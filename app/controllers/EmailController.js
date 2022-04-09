const transporter = require("../services/NodeMailerService");
const DiscordBot = require("../helpers/DiscordBot");
const { db } = require("../services/FirebaseService");
const { setDoc, doc } = require("firebase/firestore/lite");

exports.detectEmailOpen = async (req, res) => {
    const recipient = req.params['recipient'];
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    await setDoc(doc(db, "recipient", "test"), {
        email: recipient,
        opened: true,
        lastseen: date
    });
    console.log("success");
    const discordBot = new DiscordBot()
    discordBot.client.channels.cache.get("544872704289931264").send(`${recipient} has opened your email.`);
    res.status(200).send({ message: "200" });
}

exports.sendMail = (req, res) => {
    const sender = req.body["sender"];
    const recipient = req.body["recipient"];
    const messageBody = req.body["messageBody"];
    const subject = req.body["subject"];

    const htmlBody = `<p>${messageBody}</p><img src="https://fantong-discord-bot.herokuapp.com/api/recipients/${recipient}" style="display: none">`;

    const mailOptions = {
        from: sender,
        to: recipient,
        subject: subject,
        html: htmlBody
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: "500" });
            return;
        }
        console.log(recipient);
        res.status(200).send({ message: "200" });
    });
}