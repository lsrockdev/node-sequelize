const getCurrentUser = require("../helpers/current_user_helper");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fromPhone = process.env.TWILIO_PHONE_NUM;

const generateOtpCode = () => Math.floor(100000 + Math.random() * 900000);

const otpService = () => {
  const create = async (model, id) => {
    const code = generateOtpCode();
    console.log(`Generated OTP Code for ${model} ${id}`);
    const currentUser = await getCurrentUser(model, id);
    const response = await currentUser.update({ otpCode: code });

    client.messages
      .create({
        body: `Your Tapster code is: ${code}`,
        from: fromPhone,
        to: currentUser.phone
      })
      .then(message => console.log("Sent SMS:", message));
  };

  // const verify = () => {
  //   // Todo: Verify otp
  //   return true;
  // };

  return {
    create
  };
};

module.exports = otpService;
