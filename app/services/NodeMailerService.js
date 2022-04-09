const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "fankaihsiang11@gmail.com",
        pass: "dnwuwiucovfyssua"
    }
});

module.exports = transporter;