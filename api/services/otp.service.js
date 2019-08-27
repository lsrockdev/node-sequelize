const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fromPhone = process.env.TWILIO_PHONE_NUM;
const toPhone = "+13108002990";

const otpService = () => {
  const create = () => {
    client.messages
      .create({
        body: "Your Tapster code is: 000000",
        from: fromPhone,
        to: toPhone
      })
      .then(message => console.log(message.sid));
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
