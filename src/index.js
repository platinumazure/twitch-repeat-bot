const tmi = require("tmi.js");
const Denque = require("denque");

const recentMessagesByUser = {};

const client = new tmi.Client({
    identity: {
        username: "platinumazure",
        password: process.env.TWITCH_REPEAT_BOT_SECRET
    },
    channels: ["platinumazure"]
});

client.connect();

client.on("message", (channel, tags, message, self) => {
    if (self) { return; }

    const username = tags.username;

    console.log(`${tags["display-name"]}: ${message}`);

    if (!message.startsWith("!")) {
        if (!Object.prototype.hasOwnProperty.call(recentMessagesByUser, username)) {
            recentMessagesByUser[username] = new Denque([], { capacity: 10 });
        }

        recentMessagesByUser[username].unshift(message);
    }

    if (message.toLowerCase().startsWith("!repeat")) {
        const messageWords = message.split(/\s+/);      // messageWords[0] = !repeat, messageWords[1] is number
        let whichMessage = 0;

        if (messageWords.length > 1) {
            const specifiedMessageNumber = Number.parseInt(messageWords[1]);

            if (!Number.isNaN(specifiedMessageNumber)) {
                whichMessage = specifiedMessageNumber - 1;      // use 0 for first message, etc.
            }
        }

        const recentMessages = recentMessagesByUser[username];

        if (recentMessages) {
            const messageToRepeat = recentMessages.peekAt(whichMessage);

            if (messageToRepeat) {
                client.say(channel, `(repeating for ${username}) ${messageToRepeat}`);
            } else {
                client.say(channel, `${username}, could not find message #${whichMessage + 1} to repeat`);
            }
        } else {
            client.say(channel, `${username}, could not find any messages to repeat`);
        }
    }
});

console.log("twitch-repeat-bot: Successfully initialized");
