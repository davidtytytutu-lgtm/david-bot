const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder
} = require("discord.js");

const http = require("http");

// ==================================================
// CONFIGURATION
// ==================================================

const GUILD_ID = "1550531386295718060";

const GITHUB_MEME_REPO =
    "https://api.github.com/repos/davidtytytutu-lgtm/david-bot/contents/meme";

const RICK_ROLL_GIF =
    "https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif";

const WEBSITE =
    "https://david-officiel.neocities.org/";

const TIKTOK =
    "https://www.tiktok.com/@0cherif_cat0";

const NEOCITIES =
    "https://neocities.org/site/david-officiel";

// Serveur heartbeat
const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

// URL publique de DAVID BOT
const DAVID_BOT_URL =
    "https://david-bot-l5up.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 10000;

// ==================================================
// CLIENT DISCORD
// ==================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ==================================================
// SERVEUR HTTP
// ==================================================

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {

    // ----------------------------------------------
    // HEARTBEAT
    // ----------------------------------------------

    if (req.url === "/heartbeat") {

        console.log("💓 Heartbeat reçu de HEARTBEAT SERVER");

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok",
            heartbeat: true,
            from: "DAVID-BOT"
        }));

        // Répondre à HEARTBEAT après 10 secondes
        setTimeout(() => {
            sendHeartbeatToServer();
        }, HEARTBEAT_DELAY);

        return;
    }

    // ----------------------------------------------
    // PAGE PRINCIPALE
    // ----------------------------------------------

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("🤖 DAVID BOT est en ligne !");

        return;
    }

    // ----------------------------------------------
    // 404
    // ----------------------------------------------

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("404 - Not Found");
});

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🌐 Serveur HTTP démarré sur le port ${PORT}`
    );

});

// ==================================================
// HEARTBEAT
// ==================================================

let heartbeatStarted = false;

async function sendHeartbeatToServer() {

    if (!heartbeatStarted) {
        heartbeatStarted = true;
    }

    try {

        console.log(
            "💓 DAVID BOT → HEARTBEAT SERVER"
        );

        const response = await fetch(HEARTBEAT_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        console.log(
            "✅ HEARTBEAT SERVER a répondu :",
            data.status
        );

    } catch (error) {

        console.error(
            "❌ Heartbeat :",
            error.message
        );

        setTimeout(() => {
            sendHeartbeatToServer();
        }, 30000);
    }
}

// ==================================================
// COMMANDES SLASH
// ==================================================

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
        ),

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Envoie un meme aléatoire 😂"),

    new SlashCommandBuilder()
        .setName("web")
        .setDescription("Envoie le site officiel de DAVID."),

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription("Envoie le TikTok de DAVID."),

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription("Envoie le profil Neocities de DAVID.")
];

// ==================================================
// BOT PRÊT
// ==================================================

client.once("ready", async () => {

    console.log(
        `🤖 DAVID BOT connecté en tant que ${client.user.tag}`
    );

    try {

        const guild = await client.guilds.fetch(GUILD_ID);

        await guild.commands.set(commands);

        console.log(
            "✅ Commandes slash enregistrées !"
        );

    } catch (error) {

        console.error(
            "❌ Erreur commandes slash :",
            error
        );
    }

    // Premier heartbeat
    setTimeout(() => {
        sendHeartbeatToServer();
    }, 5000);
});

// ==================================================
// COMMANDES DISCORD
// ==================================================

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    // ----------------------------------------------
    // /ping
    // ----------------------------------------------

    if (interaction.commandName === "ping") {

        await interaction.reply("🏓 Pong !");

        return;
    }

    // ----------------------------------------------
    // /help
    // ----------------------------------------------

    if (interaction.commandName === "help") {

        await interaction.reply({
            content:
                "🤖 **DAVID BOT — COMMANDES**\n\n" +

                "🏓 `/ping`\n" +
                "→ Vérifie si DAVID BOT répond.\n\n" +

                "📖 `/help`\n" +
                "→ Affiche cette aide.\n\n" +

                "😈 `/rick-roll`\n" +
                "→ Rick Roll quelqu'un.\n\n" +

                "🎯 `/rick-roll utilisateur:@nom`\n" +
                "→ Rick Roll une personne précise.\n\n" +

                "😂 `/meme`\n" +
                "→ Envoie un meme aléatoire depuis GitHub.\n\n" +

                "🌐 `/web`\n" +
                "→ Envoie le site officiel.\n\n" +

                "🎵 `/tiktok`\n" +
                "→ Envoie le TikTok.\n\n" +

                "🌐 `/neocities`\n" +
                "→ Envoie le profil Neocities."
        });

        return;
    }

    // ----------------------------------------------
    // /rick-roll
    // ----------------------------------------------

    if (interaction.commandName === "rick-roll") {

        const utilisateur =
            interaction.options.getUser("utilisateur");

        if (utilisateur) {

            await interaction.reply(
                `😈 **${interaction.user} vient de Rick Roll ${utilisateur} !**\n\n${RICK_ROLL_GIF}`
            );

        } else {

            await interaction.reply(
                `😈 **Tu viens de te faire Rick Roll !**\n\n${RICK_ROLL_GIF}`
            );
        }

        return;
    }

    // ----------------------------------------------
    // /meme
    // ----------------------------------------------

    if (interaction.commandName === "meme") {

        await interaction.deferReply();

        try {

            const response = await fetch(
                GITHUB_MEME_REPO,
                {
                    headers: {
                        "User-Agent": "DAVID-BOT"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `GitHub HTTP ${response.status}`
                );
            }

            const files = await response.json();

            const memes = files.filter(file => {

                if (file.type !== "file") {
                    return false;
                }

                const name =
                    file.name.toLowerCase();

                return (
                    name.endsWith(".jpg") ||
                    name.endsWith(".jpeg") ||
                    name.endsWith(".png") ||
                    name.endsWith(".gif") ||
                    name.endsWith(".webp") ||
                    name.endsWith(".mp4") ||
                    name.endsWith(".webm")
                );
            });

            if (memes.length === 0) {

                await interaction.editReply(
                    "❌ Aucun meme trouvé dans `meme/`."
                );

                return;
            }

            const meme =
                memes[
                    Math.floor(
                        Math.random() * memes.length
                    )
                ];

            const memeURL =
                `https://raw.githubusercontent.com/davidtytytutu-lgtm/david-bot/refs/heads/main/meme/${encodeURIComponent(meme.name)}`;

            console.log(
                `😂 Meme choisi : ${meme.name}`
            );

            await interaction.editReply(
                `😂 **Meme aléatoire : ${meme.name}**\n\n${memeURL}`
            );

        } catch (error) {

            console.error(
                "❌ Erreur /meme :",
                error
            );

            await interaction.editReply(
                "❌ Impossible de récupérer un meme."
            );
        }

        return;
    }

    // ----------------------------------------------
    // /web
    // ----------------------------------------------

    if (interaction.commandName === "web") {

        await interaction.reply(
            `🌐 **DAVID OFFICIEL**\n${WEBSITE}`
        );

        return;
    }

    // ----------------------------------------------
    // /tiktok
    // ----------------------------------------------

    if (interaction.commandName === "tiktok") {

        await interaction.reply(
            `🎵 **TikTok de DAVID**\n${TIKTOK}`
        );

        return;
    }

    // ----------------------------------------------
    // /neocities
    // ----------------------------------------------

    if (interaction.commandName === "neocities") {

        await interaction.reply(
            `🌐 **Profil Neocities de DAVID**\n${NEOCITIES}`
        );

        return;
    }
});

// ==================================================
// !PING
// ==================================================

client.on("messageCreate", (message) => {

    if (message.author.bot) return;

    if (message.content === "!ping") {
        message.reply("🏓 Pong !");
    }
});

// ==================================================
// CONNEXION
// ==================================================

client.login(process.env.DISCORD_TOKEN);
