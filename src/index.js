const tmi = require("tmi.js");
const MessageStore = require("./messageStore");

let targetChannel = "platinumazure";

const scriptArgs = process.argv.slice(2);   // First two values are "node" and script path
if (scriptArgs.length) {
    targetChannel = scriptArgs[0];
}

const client = new tmi.Client({
    identity: {
        username: "twitchrepeatbot",
        password: process.env.TWITCH_REPEAT_BOT_SECRET
    },
    channels: [targetChannel]
});

const messageStore = new MessageStore();

client.on("connected", () => {
    console.log(`twitch-repeat-bot: Successfully initialized, connected to ${targetChannel}`);
});

client.on("chat", (channel, tags, message, self) => {
    if (self) { return; }

    const username = tags.username;

    console.log(`${tags["display-name"]}: ${message}`);

    if (!message.startsWith("!")) {
        messageStore.addMessage(username, message);
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

        const messageToRepeat = messageStore.getMessage(username, whichMessage);

        if (messageToRepeat) {
            client.say(channel, `(repeating for ${username}) ${messageToRepeat}`);
        } else {
            client.say(channel, `${username}, could not find message #${whichMessage + 1} to repeat`);
        }
    }
});

client.connect();
