class CommandResolver {
    // Looks up a command class by name or alias.
    // Passes null as client since we only need constructor-side metadata (aliases).
    resolve(commands, commandName) {
        return (
            commands.get(commandName) ||
            commands.find((Cmd) => {
                const i = new Cmd(null);
                return i.aliases?.includes(commandName);
            })
        );
    }
}

module.exports = CommandResolver;
