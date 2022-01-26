const Denque = require("denque");

class MessageStore {

    constructor() {
        this.recentMessagesByUser = {};
    }

    addMessage(username, message) {
        if (!Object.prototype.hasOwnProperty.call(this.recentMessagesByUser, username)) {
            this.recentMessagesByUser[username] = new Denque([], { capacity: 10 });
        }

        this.recentMessagesByUser[username].unshift(message);
    }

    getMessage(username, whichMessage) {
        if (whichMessage < 0) {
            return null;
        }

        const recentMessages = this.recentMessagesByUser[username];

        if (recentMessages) {
            const messageToRepeat = recentMessages.peekAt(whichMessage);
            return messageToRepeat || null;
        }

        return null;
    }
}

module.exports = MessageStore;
