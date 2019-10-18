const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fromPhone = process.env.TWILIO_PHONE_NUM;
const adminSmsNumbers = JSON.parse(process.env.ADMIN_SMS_NUMBERS);
const db = require("../services/db.service");

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

  const sendOrderStatusUpdateToCustomer = async (customerId, message) => {
    try {
      const customer = await db.Customer.findOne({ where: { id: customerId } });
      const response = await client.messages.create({
        body: message,
        from: fromPhone,
        to: customer.phone
      });
      console.log(
        `Sent order status update SMS to customer: ${customerId}`,
        response.body
      );
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    sendSmsToAdmins,
    sendOrderStatusUpdateToCustomer
  };
};

module.exports = notificationsService;
