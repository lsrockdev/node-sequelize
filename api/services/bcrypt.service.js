const bcrypt = require("bcrypt");

const bcryptService = () => {
  const password = user => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(user.password, salt);

    return hash;
  };

  const comparePassword = (pw, hash) => bcrypt.compareSync(pw, hash);

  // Added to allow a string without a whole user object to be passed and a hash returned:
  // Using in-model for drivers with customer getter and setter
  const passwordString = pw => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(pw, salt);

    return hash;
  };

  return {
    password,
    comparePassword,
    passwordString
  };
};

module.exports = bcryptService;
