// Chain of Responsibility base handler.
class Handler {
    setNext(handler) {
        this._next = handler;
        return handler; // fluent chaining: a.setNext(b).setNext(c)
    }

    handle(context) {
        if (this._next) return this._next.handle(context);
        return true;
    }
}

module.exports = Handler;
