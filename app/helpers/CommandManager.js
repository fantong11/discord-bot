// Command pattern: CommandManager maintains an execution history and
// supports undo, decoupling the invoker from the concrete commands.
class CommandManager {
    constructor() {
        this.history = [];
    }

    executeCmd(cmd) {
        cmd.execute();
        this.history.push(cmd);
    }

    undoLast() {
        const cmd = this.history.pop();
        if (cmd) cmd.undo();
    }
}

module.exports = CommandManager;
