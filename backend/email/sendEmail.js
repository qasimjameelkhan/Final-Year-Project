const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "siggmaalimiteds@gmail.com",
    pass: "ltlbykvtgfryrqav",
  },
});

const sendEmail = async ({ email, subject, payload }) => {
  try {
    // Define email options
    const mailOptions = {
      from: "siggmaalimiteds@gmail.com",
      to: email,
      subject: subject,
      text: payload,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email has been send: " + info.response);

    return info.response;
  } catch (error) {
    console.log("Error in sending email: " + error);
  }
};

module.exports = sendEmail;
