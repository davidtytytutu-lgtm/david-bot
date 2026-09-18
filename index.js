const { Client, GatewayIntentBits } = require("discord.js");
const http = require("http");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Petit serveur HTTP pour Render
const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("🤖 DAVID BOT est en ligne !");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`🌐 Serveur HTTP démarré sur le port ${PORT}`);
});

client.once("ready", () => {
    console.log(`🤖 DAVID BOT connecté en tant que ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content === "!ping") {
        message.reply("🏓 Pong !");
    }
});

client.login(process.env.DISCORD_TOKEN);
