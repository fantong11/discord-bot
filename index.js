const DiscordBot = require("./helpers/DiscordBot");

class Main {
    static run() {
        new DiscordBot().run();
    }
}

Main.run();