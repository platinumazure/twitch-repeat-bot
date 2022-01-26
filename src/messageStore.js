const Denque = require("denque");

class MessageStore {

    constructor() {
        this.recentMessagesByUser = new Map();
    }

    addMessage(username, message) {
        if (!this.recentMessagesByUser.has(username)) {
            this.recentMessagesByUser.set(username, new Denque([], { capacity: 10 }));
        }

        this.recentMessagesByUser.get(username).unshift(message);
    }

    getMessage(username, whichMessage) {
        if (whichMessage < 0) {
            return null;
        }

        const recentMessages = this.recentMessagesByUser.get(username);

        if (recentMessages) {
            const messageToRepeat = recentMessages.peekAt(whichMessage);
            return messageToRepeat || null;
        }

        return null;
    }
}

module.exports = MessageStore;
