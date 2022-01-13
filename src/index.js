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
        const whichMessage = 0;

        const messageToRepeat = recentMessagesByUser[username].peekAt(whichMessage);

        client.say(channel, `(repeating for ${username}) ${messageToRepeat}`);
    }
});

console.log("twitch-repeat-bot: Successfully initialized");
