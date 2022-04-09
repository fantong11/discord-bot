class CommandManager {
    constructor() {
        this.commands = [];
        this.historyCommands = [];
    }

    executeCmd(cmd) {
        this.commands.push(cmd);
        cmd.execute();
    }
}

module.exports = CommandManager;