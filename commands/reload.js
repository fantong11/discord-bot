module.exports = {
    name: "reload",
    description: "Reloads a command",
    args: true,
    usage: "[Command name]",
    execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        // 從快取中移除指令檔案
        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            // 用以更改過後的指令取代
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${command.name}\` was reloaded`);
        } catch(error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }
    }
}