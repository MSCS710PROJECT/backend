const twilio = require("twilio");

const accountSid = "AC7c6237f4710e5cdd86e32d349d4739cd"; // Replace with your Account SID
const authToken = "a6eb50e4a9f4df55c211f672a845fda8"; // Replace with your Auth Token

const client = new twilio(accountSid, authToken);

exports.sendText = async (recipient, message) => {
  return client.messages
    .create({
      body: message,
      from: "+18884951650",
      to: recipient,
    })
};
