const nodemailer = require("nodemailer");
const { NODEMAILER } = require("../config/config");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: NODEMAILER.SMTP_MAIL,
      pass: NODEMAILER.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: NODEMAILER.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail
