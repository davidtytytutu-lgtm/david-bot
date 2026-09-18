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

const GITHUB_REPO =
    "https://api.github.com/repos/davidtytytutu-lgtm/david-bot/contents/meme";

const RICK_ROLL_V1 =
    "https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif";


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
// SERVEUR HTTP POUR RENDER
// ==================================================

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
        .setDescription("Rick Roll quelqu'un ")
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription("La personne à Rick Roll")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Envoie un meme aléatoire ")
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

        console.log("✅ Commandes slash enregistrées !");

    } catch (error) {

        console.error(
            "❌ Erreur lors de l'enregistrement des commandes :",
            error
        );

    }
});

// ==================================================
// COMMANDES
// ==================================================

client.on("interactionCreate", async (interaction) => {

    if (!interaction.isChatInputCommand()) return;


    // ==================================================
    // /PING
    // ==================================================

    if (interaction.commandName === "ping") {

        await interaction.reply("🏓 Pong !");

        return;
    }


    // ==================================================
    // /HELP
    // ==================================================

    if (interaction.commandName === "help") {

        await interaction.reply({

            content:
                "🤖 **DAVID BOT — COMMANDES**\n\n" +

                "🏓 `/ping`\n" +
                "→ Vérifie si DAVID BOT répond.\n\n" +

                "📖 `/help`\n" +
                "→ Affiche cette liste.\n\n" +

                "😈 `/rick-roll`\n" +
                "→ Rick Roll quelqu'un.\n\n" +

                "🎯 `/rick-roll utilisateur:@nom`\n" +
                "→ Rick Roll une personne précise.\n\n" +

                "😂 `/meme`\n" +
                "→ Envoie un meme aléatoire depuis le dossier GitHub `meme/`.",

            ephemeral: false
        });

        return;
    }


    // ==================================================
    // /RICK-ROLL
    // ==================================================

    if (interaction.commandName === "rick-roll") {

        const utilisateur =
            interaction.options.getUser("utilisateur");


        if (utilisateur) {

            await interaction.reply(
                ` **${interaction.user} vient de Rick Roll ${utilisateur} !**\n\n${RICK_ROLL_V1}`
            );

        } else {

            await interaction.reply(
                ` **Tu viens de te faire Rick Roll lol**\n\n${RICK_ROLL_V1}`
            );

        }

        return;
    }


    // ==================================================
    // /RICK-ROLL-V2
    // ==================================================

    if (interaction.commandName === "rick-roll-v2") {

        await interaction.reply(
            `🎵 **NEVER GONNA GIVE YOU UP!**\n\n${RICK_ROLL_V2}`
        );

        return;
    }


    // ==================================================
    // /MEME
    // ==================================================

    if (interaction.commandName === "meme") {

        await interaction.deferReply();


        try {

            // Récupération du contenu du dossier meme/
            const response = await fetch(GITHUB_REPO, {

                headers: {
                    "User-Agent": "DAVID-BOT"
                }

            });


            if (!response.ok) {

                throw new Error(
                    `GitHub HTTP ${response.status}`
                );

            }


            const files = await response.json();


            // On garde uniquement les fichiers
            const memes = files.filter(file => {

                if (file.type !== "file") return false;

                const name = file.name.toLowerCase();

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


            // Aucun meme trouvé
            if (memes.length === 0) {

                await interaction.editReply(
                    "❌ Aucun meme trouvé dans le dossier `meme/`."
                );

                return;
            }


            // Choix aléatoire
            const meme =
                memes[Math.floor(Math.random() * memes.length)];


            // URL brute GitHub
            const memeURL =
                `https://raw.githubusercontent.com/davidtytytutu-lgtm/david-bot/refs/heads/main/meme/${encodeURIComponent(meme.name)}`;


            console.log(
                ` Meme choisi : ${meme.name}`
            );


            await interaction.editReply(
                ` **Meme aléatoire : ${meme.name}**\n\n${memeURL}`
            );


        } catch (error) {

            console.error(
                "❌ Erreur /meme :",
                error
            );


            await interaction.editReply(
                "❌ Impossible de récupérer un meme depuis GitHub."
            );

        }

        return;
    }

});

// ==================================================
// ANCIENNE COMMANDE !PING
// ==================================================

client.on("messageCreate", (message) => {

    if (message.author.bot) return;


    if (message.content === "!ping") {

        message.reply("🏓 Pong !");

    }

});

// ==================================================
// CONNEXION DISCORD
// ==================================================

client.login(process.env.DISCORD_TOKEN);
