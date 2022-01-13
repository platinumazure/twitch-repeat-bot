const tmi = require("tmi.js");

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

    // "Alca: Hello, World!"
    console.log(`${tags["display-name"]}: ${message}`);

    if (message.toLowerCase().startsWith("!repeat")) {
        client.say(channel, `Hi @${tags.username}, message received!`);
    }
});

console.log("twitch-repeat-bot: Successfully initialized");
