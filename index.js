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

const RICK_ROLL_GIF =
    "https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif";

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
        .setDescription("Vérifie si DAVID BOT répond."),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche les commandes disponibles."),

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription("Rick Roll quelqu'un 😈")
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("La personne à Rick Roll")
                .setRequired(false)
        )
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
        console.error(
            "❌ Erreur lors de l'enregistrement des commandes :",
            error
        );
    }
});

// ===============================
// COMMANDES SLASH
// ===============================

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // ===========================
    // /ping
    // ===========================

    if (interaction.commandName === "ping") {
        await interaction.reply("🏓 Pong !");
    }

    // ===========================
    // /help
    // ===========================

    if (interaction.commandName === "help") {
        await interaction.reply({
            content:
                "🤖 **DAVID BOT — COMMANDES**\n\n" +
                "🏓 `/ping` — Vérifie si le bot répond.\n" +
                "📖 `/help` — Affiche cette aide.\n" +
                "😈 `/rick-roll` — Rick Roll quelqu'un.\n" +
                "🎯 `/rick-roll @utilisateur` — Rick Roll une personne précise.",
            ephemeral: false
        });
    }

    // ===========================
    // /rick-roll
    // ===========================

    if (interaction.commandName === "rick-roll") {
        const utilisateur = interaction.options.getUser("utilisateur");

        if (utilisateur) {
            await interaction.reply(
                ` **${interaction.user} vient de Rick Roll ${utilisateur} !**\n\n${RICK_ROLL_GIF}`
            );
        } else {
            await interaction.reply(
                ` **never gonna give you up**\n\n${RICK_ROLL_GIF}`
            );
        }
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
