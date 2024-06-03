const nodemailer = require("nodemailer");
const { Decrypter } = require("./cryptography");

let password = "";
Decrypter("334381f4aa236941a6d80e6b57eee75d", (err, encryted) => {
  if (err) console.error("Error: ", err);
  console.log(encryted);
  password = encryted;
});

// Create a Nodemailer transporter with custom SMTP settings
const transporter = nodemailer.createTransport({
  host: "mail.5lsolutions.com", // Your mail server hostname or IP address
  port: 587, // Your mail server port (587 is the default for secure SMTP)
  secure: false, // Set to true if your server uses SSL/TLS, otherwise false
  auth: {
    user: "5lpos@5lsolutions.com",
    pass: password,
  },
});

exports.SendEmail = (to, subject, text) => {
  // Email content
  const mailOptions = {
    from: "5lpos@5lsolutions.com",
    to: to,
    subject: subject,
    html: text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log(info);
      console.log("Email sent: " + info.response);
    }
  });
};
