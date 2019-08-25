const JWTService = require("../services/auth.service");
const User = require("../../models").Customer;

// usually: "Authorization: Bearer [token]" or "token: [token]"
module.exports = (req, res, next) => {
  let tokenToVerify;

  if (req.header("Authorization")) {
    const parts = req.header("Authorization").split(" ");

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/.test(scheme)) {
        tokenToVerify = credentials;
      } else {
        return res
          .status(401)
          .json({ msg: "Format for Authorization: Bearer [token]" });
      }
    } else {
      return res
        .status(401)
        .json({ msg: "Format for Authorization: Bearer [token]" });
    }
  } else if (req.body.token) {
    tokenToVerify = req.body.token;
    delete req.query.token;
  } else {
    return res.status(401).json({ msg: "No Authorization was found" });
  }

  return JWTService().verify(tokenToVerify, async (err, thisToken) => {
    console.log(thisToken);
    if (err) return res.status(401).json({ err });

    // Look up and return user record in db to pass along as req.user:
    const user = await User.findOne({
      where: {
        id: thisToken.id
      }
    });
    if (!user) {
      throw new Error();
    }

    // returns req.token and req.user (the current authenticated user) to the function that called auth:
    req.token = thisToken;
    req.user = user;
    return next();
  });
};
