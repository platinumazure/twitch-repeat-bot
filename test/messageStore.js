const assert = require("assert");
const MessageStore = require("../src/messageStore");

describe("MessageStore", function() {
    let messageStore;

    beforeEach(function() {
        messageStore = new MessageStore();
    });

    describe("addMessage", function() {
        it("should add message from a new username", function() {
            messageStore.addMessage("platinumazure", "test message");
        });

        it("should add multiple messages from the same username", function() {
            messageStore.addMessage("platinumazure", "test message");
            messageStore.addMessage("platinumazure", "test message 2");
        });

        it("should add messages from different usernames", function() {
            messageStore.addMessage("platinumazure", "test message");
            messageStore.addMessage("mattrim101", "test message 2");
        });

        it("should add more than 10 messages without crashing", function() {
            for (const i of Array(11).keys()) {
                messageStore.addMessage("platinumazure", `test message ${i}`);
            }
        });
    });

    describe("getMessage", function() {
        it("should get most recent message if passed 0", function() {
            messageStore.addMessage("platinumazure", "test message");

            const result = messageStore.getMessage("platinumazure", 0);
            assert.strictEqual(result, "test message");
        });

        it("should get second most recent message if passed 1", function() {
            messageStore.addMessage("platinumazure", "test message");
            messageStore.addMessage("platinumazure", "test message 2");

            const result = messageStore.getMessage("platinumazure", 1);
            assert.strictEqual(result, "test message");
        });

        it("should get message from correct person even if other people add messages too", function() {
            messageStore.addMessage("platinumazure", "test message");
            messageStore.addMessage("mattrim101", "test message 2");

            const result = messageStore.getMessage("platinumazure", 0);
            assert.strictEqual(result, "test message");
        });

        it("should get message from correct person even if other people add messages too", function() {
            messageStore.addMessage("platinumazure", "test message");
            messageStore.addMessage("platinumazure", "test message 2");
            messageStore.addMessage("mattrim101", "test message 3");
            messageStore.addMessage("platinumazure", "test message 4");

            const result = messageStore.getMessage("platinumazure", 1);
            assert.strictEqual(result, "test message 2");
        });

        it("should get 10th most recent message if passed index of 9", function() {
            for (const i of Array(10).keys()) {
                messageStore.addMessage("platinumazure", `test message ${i}`);
            }

            const result = messageStore.getMessage("platinumazure", 9);
            assert.strictEqual(result, "test message 0");
        });

        it("should get 10th most recent message if passed index of 9, even if more than 10 messages are sent", function() {
            for (const i of Array(50).keys()) {
                messageStore.addMessage("platinumazure", `test message ${i}`);
            }

            const result = messageStore.getMessage("platinumazure", 9);
            assert.strictEqual(result, "test message 40");
        });

        it("should return null if passed 0 and no messages were added for username", function() {
            const result = messageStore.getMessage("platinumazure", 0);
            assert.strictEqual(result, null);
        });

        it("should return null if passed 0 and no messages were added for username but messages were added for others", function() {
            messageStore.addMessage("mattrim101", "test message");

            const result = messageStore.getMessage("platinumazure", 0);
            assert.strictEqual(result, null);
        });

        it("should return null if messages are present but index is too high", function() {
            for (const i of Array(10).keys()) {
                messageStore.addMessage("platinumazure", `test message ${i}`);
            }

            const result = messageStore.getMessage("platinumazure", 12);
            assert.strictEqual(result, null);
        });

        it("should return null if index is negative", function() {
            messageStore.addMessage("platinumazure", "test message");

            const result = messageStore.getMessage("platinumazure", -1);
            assert.strictEqual(result, null);
        });
    });
});
