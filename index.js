const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder
} = require("discord.js");

const http = require("http");

// ===============================
// CONFIGURATION
// ===============================

const GUILD_ID = "1550531386295718060";

// ===============================
// CLIENT DISCORD
// ===============================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ===============================
// SERVEUR HTTP POUR RENDER
// ===============================

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

// ===============================
// COMMANDES SLASH
// ===============================

const commands = [
    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Vérifie si DAVID BOT répond.")
];

// ===============================
// BOT PRÊT
// ===============================

client.once("ready", async () => {
    console.log(`🤖 DAVID BOT connecté en tant que ${client.user.tag}`);

    try {
        const guild = await client.guilds.fetch(GUILD_ID);

        await guild.commands.set(commands);

        console.log("✅ Commandes slash enregistrées !");
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement des commandes :", error);
    }
});

// ===============================
// COMMANDES SLASH
// ===============================

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("🏓 Pong !");
    }
});

// ===============================
// ANCIENNE COMMANDE !PING
// ===============================

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    if (message.content === "!ping") {
        message.reply("🏓 Pong !");
    }
});

// ===============================
// CONNEXION
// ===============================

client.login(process.env.DISCORD_TOKEN);
