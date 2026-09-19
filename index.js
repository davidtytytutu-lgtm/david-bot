const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder
} = require("discord.js");

const http = require("http");

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

/* =========================
   HEARTBEAT
========================= */

const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

const DAVID_BOT_URL =
    "https://david-bot-l5up.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 5000;

/* =========================
   ROLES
========================= */

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};

/* =========================
   DISCORD CLIENT
========================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

/* =========================
   HTTP SERVER
========================= */

const PORT = process.env.PORT || 10000;

const server = http.createServer((req, res) => {

    /* ===== HEARTBEAT ===== */

    if (req.url === "/heartbeat") {

        console.log(
            "💓 Heartbeat reçu de HEARTBEAT SERVER"
        );

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok",
            heartbeat: true,
            from: "DAVID-BOT"
        }));

        setTimeout(() => {
            sendHeartbeatToServer();
        }, HEARTBEAT_DELAY);

        return;
    }

    /* ===== PAGE PRINCIPALE ===== */

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end(
            "🤖 DAVID BOT est en ligne !"
        );

        return;
    }

    /* ===== 404 ===== */

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("404 - Not Found");
});

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🌐 Serveur HTTP démarré sur le port ${PORT}`
        );

    }
);

/* =========================
   SEND HEARTBEAT
========================= */

async function sendHeartbeatToServer() {

    try {

        console.log(
            "💓 DAVID BOT → HEARTBEAT SERVER"
        );

        const response = await fetch(
            HEARTBEAT_URL
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
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

        console.log(
            "🔄 Nouvelle tentative dans 30 secondes..."
        );

        setTimeout(() => {
            sendHeartbeatToServer();
        }, 30000);
    }
}

/* =========================
   SLASH COMMANDS
========================= */

const commands = [

    /* PING */

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Vérifie si DAVID BOT répond."
        ),

    /* HELP */

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Affiche les commandes disponibles."
        ),

    /* RICK ROLL */

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription(
            "Rick Roll quelqu'un 😈"
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription(
                    "La personne à Rick Roll"
                )
                .setRequired(false)
        ),

    /* MEME */

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription(
            "Envoie un meme aléatoire 😂"
        ),

    /* WEBSITE */

    new SlashCommandBuilder()
        .setName("web")
        .setDescription(
            "Envoie le site officiel de DAVID."
        ),

    /* TIKTOK */

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription(
            "Envoie le TikTok de DAVID."
        ),

    /* NEOCITIES */

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription(
            "Envoie le profil Neocities de DAVID."
        ),

    /* ROLE */

    new SlashCommandBuilder()
        .setName("role")
        .setDescription(
            "Obtenir ou retirer un rôle."
        )
        .addStringOption(option =>
            option
                .setName("role")
                .setDescription(
                    "Choisis le rôle"
                )
                .setRequired(true)
                .addChoices(
                    {
                        name: "🗿 Wojak",
                        value: "wojak"
                    },
                    {
                        name: "🧌 Troll",
                        value: "troll"
                    }
                )
        )

];

/* =========================
   BOT READY
========================= */

client.once("ready", async () => {

    console.log(
        `🤖 DAVID BOT connecté en tant que ${client.user.tag}`
    );

    try {

        const guild =
            await client.guilds.fetch(GUILD_ID);

        await guild.commands.set(commands);

        console.log(
            "✅ Commandes slash enregistrées !"
        );

    } catch (error) {

        console.error(
            "❌ Erreur lors de l'enregistrement des commandes :",
            error
        );

    }

    /* =========================
       START HEARTBEAT
    ========================= */

    setTimeout(() => {

        sendHeartbeatToServer();

    }, 5000);

});

/* =========================
   INTERACTIONS
========================= */

client.on(
    "interactionCreate",
    async (interaction) => {

        if (!interaction.isChatInputCommand()) {
            return;
        }

        /* =========================
           PING
        ========================= */

        if (interaction.commandName === "ping") {

            await interaction.reply(
                "🏓 Pong !"
            );

            return;
        }

        /* =========================
           HELP
        ========================= */

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
                    "→ Envoie le site officiel de DAVID.\n\n" +

                    "🎵 `/tiktok`\n" +
                    "→ Envoie le TikTok de DAVID.\n\n" +

                    "🌐 `/neocities`\n" +
                    "→ Envoie le profil Neocities de DAVID.\n\n" +

                    "🎭 `/role`\n" +
                    "→ Obtenir ou retirer un rôle.\n\n" +

                    "🗿 **Wojak**\n" +
                    "🧌 **Troll**",

                ephemeral: false

            });

            return;
        }

        /* =========================
           RICK ROLL
        ========================= */

        if (
            interaction.commandName ===
            "rick-roll"
        ) {

            const utilisateur =
                interaction.options.getUser(
                    "utilisateur"
                );

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

        /* =========================
           MEME
        ========================= */

        if (
            interaction.commandName ===
            "meme"
        ) {

            await interaction.deferReply();

            try {

                const response =
                    await fetch(
                        GITHUB_MEME_REPO,
                        {
                            headers: {
                                "User-Agent":
                                    "DAVID-BOT"
                            }
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `GitHub HTTP ${response.status}`
                    );

                }

                const files =
                    await response.json();

                const memes =
                    files.filter(file => {

                        if (
                            file.type !==
                            "file"
                        ) {
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

                if (
                    memes.length === 0
                ) {

                    await interaction.editReply(
                        "❌ Aucun meme trouvé dans le dossier `meme/`."
                    );

                    return;
                }

                const meme =
                    memes[
                        Math.floor(
                            Math.random() *
                            memes.length
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
                    "❌ Impossible de récupérer un meme depuis GitHub."
                );

            }

            return;
        }

        /* =========================
           WEBSITE
        ========================= */

        if (
            interaction.commandName ===
            "web"
        ) {

            await interaction.reply(
                `🌐 **DAVID OFFICIEL**\n${WEBSITE}`
            );

            return;
        }

        /* =========================
           TIKTOK
        ========================= */

        if (
            interaction.commandName ===
            "tiktok"
        ) {

            await interaction.reply(
                `🎵 **TikTok de DAVID**\n${TIKTOK}`
            );

            return;
        }

        /* =========================
           NEOCITIES
        ========================= */

        if (
            interaction.commandName ===
            "neocities"
        ) {

            await interaction.reply(
                `🌐 **Profil Neocities de DAVID**\n${NEOCITIES}`
            );

            return;
        }

        /* =========================
           ROLE
        ========================= */

        if (
            interaction.commandName ===
            "role"
        ) {

            const roleName =
                interaction.options.getString(
                    "role"
                );

            const roleId =
                ROLES[roleName];

            if (!roleId) {

                await interaction.reply({
                    content:
                        "❌ Ce rôle n'existe pas.",
                    ephemeral: true
                });

                return;
            }

            try {

                const role =
                    await interaction.guild.roles.fetch(
                        roleId
                    );

                if (!role) {

                    await interaction.reply({
                        content:
                            "❌ Rôle introuvable sur le serveur.",
                        ephemeral: true
                    });

                    return;
                }

                /* Vérifie la hiérarchie */

                if (
                    role.position >=
                    interaction.guild.members.me.roles.highest.position
                ) {

                    await interaction.reply({
                        content:
                            "❌ Je ne peux pas gérer ce rôle car mon rôle est placé trop bas dans la hiérarchie Discord.",
                        ephemeral: true
                    });

                    return;
                }

                const member =
                    await interaction.guild.members.fetch(
                        interaction.user.id
                    );

                /* =========================
                   RETIRER LE ROLE
                ========================= */

                if (
                    member.roles.cache.has(
                        roleId
                    )
                ) {

                    await member.roles.remove(
                        role
                    );

                    await interaction.reply(
                        `❌ ${role} a été retiré de ${interaction.user}.`
                    );

                    console.log(
                        `🎭 Rôle retiré : ${role.name} → ${interaction.user.tag}`
                    );

                }

                /* =========================
                   AJOUTER LE ROLE
                ========================= */

                else {

                    await member.roles.add(
                        role
                    );

                    await interaction.reply(
                        `✅ ${role} a été ajouté à ${interaction.user}.`
                    );

                    console.log(
                        `🎭 Rôle ajouté : ${role.name} → ${interaction.user.tag}`
                    );

                }

            } catch (error) {

                console.error(
                    "❌ Erreur /role :",
                    error
                );

                if (
                    !interaction.replied
                ) {

                    await interaction.reply({
                        content:
                            "❌ Impossible de modifier ton rôle. Vérifie que DAVID BOT possède la permission **Gérer les rôles**.",
                        ephemeral: true
                    });

                }

            }

            return;
        }

    }
);

/* =========================
   !PING CLASSIQUE
========================= */

client.on(
    "messageCreate",
    (message) => {

        if (message.author.bot) {
            return;
        }

        if (
            message.content ===
            "!ping"
        ) {

            message.reply(
                "🏓 Pong !"
            );

        }

    }
);

/* =========================
   LOGIN
========================= */

client.login(
    process.env.DISCORD_TOKEN
);
