// Chain of Responsibility pattern: abstract base handler.
// Each concrete handler either short-circuits the chain or passes to the next.
class Handler {
    setNext(handler) {
        this._next = handler;
        return handler; // enables fluent chaining: a.setNext(b).setNext(c)
    }

    handle(context) {
        if (this._next) {
            return this._next.handle(context);
        }
        return true;
    }
}

module.exports = Handler;
