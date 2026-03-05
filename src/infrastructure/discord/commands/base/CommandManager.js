class CommandManager {
    constructor() {
        this.history = [];
    }

    // Returns whatever execute() returns (may be a Promise).
    executeCmd(cmd) {
        const result = cmd.execute();
        this.history.push(cmd);
        return result;
    }

    undoLast() {
        const cmd = this.history.pop();
        if (cmd) cmd.undo();
    }
}

module.exports = CommandManager;
