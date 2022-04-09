const express = require("express");
const bodyParser = require("body-parser");
const DiscordBot = require("./app/helpers/DiscordBot");
var cors = require("cors");

const server = "https://fantong-discord-bot.herokuapp.com/";
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        "message": "Hi this is mail tracker node server",
        "url": server
    });
});

app.use("/api", require("./app/routes/EmailRoute.js"));

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is listening...url: " + server);
});

new DiscordBot().run();