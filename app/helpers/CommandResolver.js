// SRP: single responsibility of resolving a command name/alias to its class.
// Eliminates the duplication between message.js and reload.js.
class CommandResolver {
    resolve(commands, commandName) {
        return (
            commands.get(commandName) ||
            commands.find((Cmd) => {
                const instance = new Cmd();
                return instance.aliases && instance.aliases.includes(commandName);
            })
        );
    }
}

module.exports = CommandResolver;
