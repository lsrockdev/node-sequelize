const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fromPhone = process.env.TWILIO_PHONE_NUM;
const adminSmsNumbers = JSON.parse(process.env.ADMIN_SMS_NUMBERS);

const notificationsService = () => {
  const sendSmsToAdmins = async message => {
    try {
      const response = await client.messages.create({
        body: message,
        from: fromPhone,
        to: adminSmsNumbers
      });
      console.log("Sent SMS:", response.body);
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    sendSmsToAdmins
  };
};

module.exports = notificationsService;
