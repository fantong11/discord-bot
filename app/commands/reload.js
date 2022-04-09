const Command = require("../helpers/Command");

class Reload extends Command {
    constructor() {
        super("reload", "Reloads a command")
        this.argsIsRequired = true;
        this.aliases = ["r"];
        this.usage = "[Command name]";
    }

    execute() {
        const commandName = this.args[0].toLowerCase();
        const Command = this.commandIsExist(this.message.client.commands, commandName);

        if (!Command) return this.message.channel.send(`There is no command with name or alias \`${commandName}\`, ${this.message.author}!`);
        const command = new Command();

        // 從快取中移除指令檔案
        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            // 用以更改過後的指令取代
            const newCommand = require(`./${command.name}.js`);
            // 如果改name會有問題
            this.message.client.commands.set(command.name, newCommand);
            this.message.channel.send(`Command \`${command.name}\` was reloaded`);
        } catch(error) {
            console.error(error);
            this.message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }

    commandIsExist(commands, commandName) {
        const Command = commands.get(commandName)
            || commands.find(Command => new Command().aliases && new Command().aliases.includes(commandName));

        return Command;
    }
}

module.exports = Reload;