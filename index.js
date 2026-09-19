const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const http = require("http");

// ============================================================
// CONFIGURATION
// ============================================================

const TOKEN = process.env.DISCORD_TOKEN;

const GUILD_ID = "1550531386295718060";

const GITHUB_MEME_REPO =
    "https://api.github.com/repos/davidtytytutu-lgtm/david-bot/contents/meme?ref=main";

const RICK_ROLL_GIF =
    "https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif";

const WEBSITE =
    "https://david-officiel.neocities.org/";

const TIKTOK =
    "https://www.tiktok.com/@0cherif_cat0";

const NEOCITIES =
    "https://neocities.org/site/david-officiel";

const REPOSITORY =
    "https://github.com/davidtytytutu-lgtm/david-bot";

const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 10000;

const RGB_DELAY = 7000;

const BOT_START_TIME = Date.now();

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};

// ============================================================
// RGB
// ============================================================

const RGB_NAMES = [
    "🔴𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🔴",
    "🟠𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🟠",
    "🟡𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🟡",
    "🟢𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🟢",
    "🔵𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🔵",
    "⚫𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭⚫",
    "🟤𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🟤",
    "🟣𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭🟣"
];

let rgbIndex = 0;
let rgbStarted = false;

// ============================================================
// CLIENT
// ============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// ============================================================
// HELPERS
// ============================================================

function formatUptime(ms) {
    let seconds = Math.floor(ms / 1000);

    const days = Math.floor(seconds / 86400);
    seconds %= 86400;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const parts = [];

    if (days) parts.push(`${days}j`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
}

function formatBytes(bytes) {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    let i = 0;
    let value = bytes;

    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }

    return `${value.toFixed(2)} ${units[i]}`;
}

function truncate(text, max = 1000) {
    if (!text) return "";

    text = String(text);

    if (text.length <= max) return text;

    return text.slice(0, max - 3) + "...";
}

function avatar(user) {
    return user.displayAvatarURL({
        extension: "png",
        size: 256
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer((req, res) => {

    if (req.url === "/heartbeat") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            online: true,
            bot: "DAVID BOT",
            timestamp: Date.now()
        }));

        console.log("💓 Heartbeat reçu");

        return;
    }

    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });

    res.end(`
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>DAVID BOT</title>
<style>
body {
    background: #050505;
    color: #00ff66;
    font-family: monospace;
    text-align: center;
    padding-top: 80px;
}
h1 {
    font-size: 42px;
}
.box {
    border: 1px solid #00ff66;
    padding: 30px;
    max-width: 600px;
    margin: auto;
}
</style>
</head>
<body>
<div class="box">
<h1>DAVID BOT</h1>
<p>🟢 ONLINE</p>
<p>Discord bot actif.</p>
<p>Uptime : ${formatUptime(Date.now() - BOT_START_TIME)}</p>
</div>
</body>
</html>
`);
});

server.listen(process.env.PORT || 3000, () => {
    console.log(
        `🌐 Serveur HTTP lancé sur le port ${process.env.PORT || 3000}`
    );
});

// ============================================================
// HEARTBEAT
// ============================================================

async function sendHeartbeatToServer() {

    console.log("💓 Tentative d'envoi du heartbeat...");

    try {

        console.log(`💓 DAVID BOT → ${HEARTBEAT_URL}`);

        const response = await fetch(HEARTBEAT_URL);

        console.log(
            `💓 Réponse heartbeat : HTTP ${response.status}`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let data;

        try {
            data = await response.json();
        } catch {
            data = await response.text();
        }

        console.log("✅ Heartbeat réussi :", data);

    } catch (error) {

        console.error(
            "❌ Heartbeat échoué :",
            error.message
        );
    }

    setTimeout(
        sendHeartbeatToServer,
        HEARTBEAT_DELAY
    );
}

// ============================================================
// RGB NAME
// ============================================================

async function changeRGBName() {

    try {

        const guild = await client.guilds.fetch(GUILD_ID);

        if (!guild) {
            console.error("❌ RGB : serveur introuvable.");
            return;
        }

        const botMember = await guild.members.fetch(
            client.user.id,
            {
                force: true
            }
        );

        if (!botMember) {
            console.error("❌ RGB : membre bot introuvable.");
            return;
        }

        const newName = RGB_NAMES[rgbIndex];

        console.log(
            `🌈 Changement du nom → ${newName}`
        );

        if (botMember.nickname === newName) {

            console.log(
                `ℹ️ RGB : nom déjà identique → ${newName}`
            );

            rgbIndex =
                (rgbIndex + 1) % RGB_NAMES.length;

            return;
        }

        await botMember.setNickname(
            newName,
            "DAVID BOT - RGB"
        );

        await sleep(500);

        let updatedMember =
            await guild.members.fetch({
                user: client.user.id,
                force: true
            });

        if (updatedMember.nickname === newName) {

            console.log(
                `✅ Nom changé → ${newName}`
            );

        } else {

            console.log(
                `⚠️ RGB : changement non confirmé → ${newName}`
            );

            await sleep(1000);

            try {

                await botMember.setNickname(
                    newName,
                    "DAVID BOT - RGB retry"
                );

            } catch (retryError) {

                console.error(
                    "❌ RGB retry :",
                    retryError.message
                );
            }

            await sleep(700);

            updatedMember =
                await guild.members.fetch({
                    user: client.user.id,
                    force: true
                });

            if (updatedMember.nickname === newName) {

                console.log(
                    `✅ RGB retry réussi → ${newName}`
                );

            } else {

                console.log(
                    `❌ RGB : nom toujours non confirmé → ${newName}`
                );
            }
        }

        rgbIndex =
            (rgbIndex + 1) % RGB_NAMES.length;

    } catch (error) {

        console.error(
            "❌ RGB erreur :",
            error.message
        );

        console.error(
            "❌ RGB code :",
            error.code || "N/A"
        );

        rgbIndex =
            (rgbIndex + 1) % RGB_NAMES.length;
    }
}

function startRGB() {

    if (rgbStarted) return;

    rgbStarted = true;

    console.log("🌈 RGB : démarrage...");

    changeRGBName();

    setInterval(
        changeRGBName,
        RGB_DELAY
    );
}

// ============================================================
// SLASH COMMANDS
// ============================================================

const commands = [

    // --------------------------------------------------------
    // PING
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Affiche la latence du bot."),

    // --------------------------------------------------------
    // HELP
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la liste des commandes."),

    // --------------------------------------------------------
    // RICK ROLL
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription("😈 Tu viens de te faire Rick Roll."),

    // --------------------------------------------------------
    // MEME
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription("😂 Envoie un meme aléatoire."),

    // --------------------------------------------------------
    // WEB
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("web")
        .setDescription("🌐 Affiche le site de DAVID."),

    // --------------------------------------------------------
    // TIKTOK
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription("🎵 Affiche le TikTok de DAVID."),

    // --------------------------------------------------------
    // NEOCITIES
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription("🌐 Affiche la page Neocities."),

    // --------------------------------------------------------
    // ROLE
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("role")
        .setDescription("🎭 Ajoute ou retire un rôle.")
        .addStringOption(option =>
            option
                .setName("role")
                .setDescription("Rôle à donner ou retirer.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Wojak",
                        value: "wojak"
                    },
                    {
                        name: "Troll",
                        value: "troll"
                    }
                )
        ),

    // --------------------------------------------------------
    // BOT INFO
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("🤖 Affiche les informations du bot."),

    // --------------------------------------------------------
    // UPTIME
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("⏱️ Affiche depuis combien de temps le bot est actif."),

    // --------------------------------------------------------
    // INVITE
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("🔗 Génère un lien pour inviter DAVID BOT."),

    // --------------------------------------------------------
    // ROLES
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("roles")
        .setDescription("🎭 Affiche les rôles du serveur."),

    // --------------------------------------------------------
    // USERINFO
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("👤 Affiche les informations d'un utilisateur.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Utilisateur à afficher.")
                .setRequired(false)
        ),

    // --------------------------------------------------------
    // SERVERINFO
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("🏠 Affiche les informations du serveur."),

    // --------------------------------------------------------
    // COINFLIP
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("🪙 Lance une pièce."),

    // --------------------------------------------------------
    // DICE
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription("🎲 Lance un dé.")
        .addIntegerOption(option =>
            option
                .setName("faces")
                .setDescription("Nombre de faces.")
                .setMinValue(2)
                .setMaxValue(1000)
                .setRequired(false)
        ),

    // --------------------------------------------------------
    // SHIP
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription("❤️ Calcule un pourcentage d'amour.")
        .addUserOption(option =>
            option
                .setName("user1")
                .setDescription("Première personne.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("user2")
                .setDescription("Deuxième personne.")
                .setRequired(true)
        ),

    // --------------------------------------------------------
    // SAY
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("say")
        .setDescription("💬 Fait parler DAVID BOT.")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message à envoyer.")
                .setRequired(true)
        ),

    // --------------------------------------------------------
    // TTS
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("tts")
        .setDescription("🔊 Transforme un texte en audio.")
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription("Texte à prononcer.")
                .setRequired(true)
        ),

    // --------------------------------------------------------
    // REPO
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("repo")
        .setDescription("💻 Affiche le GitHub de DAVID BOT."),

    // --------------------------------------------------------
    // QR
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("qr")
        .setDescription("📱 Génère un QR code.")
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription("Texte ou URL.")
                .setRequired(true)
        ),

    // --------------------------------------------------------
    // IP
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ip")
        .setDescription("🌍 Analyse une IP ou une adresse de serveur.")
        .addStringOption(option =>
            option
                .setName("adresse")
                .setDescription("Exemple : 8.8.8.8 ou 192.168.1.65:27015")
                .setRequired(true)
        )
];

// ============================================================
// READY
// ============================================================

client.once("clientReady", async () => {

    console.log("");
    console.log("====================================");
    console.log("       DAVID BOT ONLINE");
    console.log("====================================");

    console.log(
        `🤖 Connecté en tant que ${client.user.tag}`
    );

    console.log(
        `🆔 ID : ${client.user.id}`
    );

    console.log(
        `🌐 Serveurs : ${client.guilds.cache.size}`
    );

    console.log(
        `📦 Commandes : ${commands.length}`
    );

    console.log(
        `🟢 Node.js : ${process.version}`
    );

    console.log(
        `🧩 Discord.js : ${require("discord.js").version}`
    );

    // --------------------------------------------------------
    // CLEAN OLD GUILD COMMANDS
    // --------------------------------------------------------

    try {

        const guild =
            await client.guilds.fetch(GUILD_ID);

        console.log(
            "🧹 Suppression des anciennes commandes serveur..."
        );

        await guild.commands.set([]);

        console.log(
            "✅ Anciennes commandes serveur supprimées."
        );

    } catch (error) {

        console.error(
            "❌ Impossible de nettoyer les commandes serveur :",
            error.message
        );
    }

    // --------------------------------------------------------
    // GLOBAL COMMANDS
    // --------------------------------------------------------

    try {

        console.log(
            "📡 Enregistrement des commandes globales..."
        );

        await client.application.commands.set(
            commands
        );

        console.log(
            `✅ ${commands.length} commandes globales enregistrées.`
        );

    } catch (error) {

        console.error(
            "❌ Erreur commandes :",
            error
        );
    }

    // --------------------------------------------------------
    // RGB
    // --------------------------------------------------------

    startRGB();

    // --------------------------------------------------------
    // HEARTBEAT
    // --------------------------------------------------------

    setTimeout(
        sendHeartbeatToServer,
        5000
    );

    console.log(
        "💓 Heartbeat programmé."
    );

    console.log(
        "===================================="
    );
    console.log("");
});

// ============================================================
// INTERACTIONS
// ============================================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = interaction.commandName;

    console.log(
        `📥 Commande /${command} utilisée par ${interaction.user.tag}`
    );

    try {

        // ====================================================
        // PING
        // ====================================================

        if (command === "ping") {

            const sent = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff66)
                        .setTitle("🏓 PONG")
                        .setDescription("DAVID BOT est opérationnel.")
                        .addFields(
                            {
                                name: "📡 Latence",
                                value: `${Date.now() - interaction.createdTimestamp} ms`,
                                inline: true
                            },
                            {
                                name: "💓 WebSocket",
                                value: `${client.ws.ping} ms`,
                                inline: true
                            }
                        )
                ],
                fetchReply: true
            });

            return;
        }

        // ====================================================
        // HELP
        // ====================================================

        if (command === "help") {

            const embed = new EmbedBuilder()
                .setColor(0x5865f2)
                .setTitle("🤖 DAVID BOT — HELP")
                .setDescription(
                    "Voici les commandes disponibles."
                )
                .addFields(
                    {
                        name: "🌐 Informations",
                        value:
                            "`/ping` `/botinfo` `/uptime` `/serverinfo` `/userinfo` `/roles`"
                    },
                    {
                        name: "🎮 Fun",
                        value:
                            "`/meme` `/rick-roll` `/coinflip` `/dice` `/ship`"
                    },
                    {
                        name: "🎭 Serveur",
                        value:
                            "`/role` `/say` `/tts`"
                    },
                    {
                        name: "🔗 Internet",
                        value:
                            "`/web` `/tiktok` `/neocities` `/repo` `/invite` `/qr` `/ip`"
                    }
                )
                .setFooter({
                    text: `DAVID BOT • ${commands.length} commandes`
                });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // RICK ROLL
        // ====================================================

        if (command === "rick-roll") {

            const embed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle("😈 NEVER GONNA GIVE YOU UP")
                .setImage(RICK_ROLL_GIF)
                .setDescription(
                    "🎵 Tu viens de te faire Rick Roll."
                );

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // MEME
        // ====================================================

        if (command === "meme") {

            await interaction.deferReply();

            try {

                console.log(
                    "😂 MEME : récupération du dossier GitHub..."
                );

                const response = await fetch(
                    GITHUB_MEME_REPO,
                    {
                        headers: {
                            "Accept":
                                "application/vnd.github+json",

                            "User-Agent":
                                "DAVID-BOT"
                        }
                    }
                );

                console.log(
                    `😂 MEME : GitHub HTTP ${response.status}`
                );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    console.error(
                        "❌ MEME : erreur GitHub :",
                        errorText
                    );

                    throw new Error(
                        `GitHub HTTP ${response.status}`
                    );
                }

                const files =
                    await response.json();

                console.log(
                    `😂 MEME : ${files.length} éléments trouvés`
                );

                if (!Array.isArray(files)) {

                    throw new Error(
                        "GitHub n'a pas renvoyé une liste de fichiers."
                    );
                }

                const allowedExtensions = [
                    ".png",
                    ".jpg",
                    ".jpeg",
                    ".gif",
                    ".webp"
                ];

                const memes = files.filter(file => {

                    if (!file) return false;

                    if (file.type !== "file") {
                        return false;
                    }

                    const name =
                        String(
                            file.name || ""
                        ).toLowerCase();

                    return allowedExtensions.some(
                        extension =>
                            name.endsWith(extension)
                    );
                });

                console.log(
                    `😂 MEME : ${memes.length} images trouvées`
                );

                if (memes.length === 0) {

                    throw new Error(
                        "Aucune image trouvée dans /meme."
                    );
                }

                const meme =
                    memes[
                        Math.floor(
                            Math.random() *
                            memes.length
                        )
                    ];

                console.log(
                    `😂 MEME : image choisie → ${meme.name}`
                );

                console.log(
                    `🔗 MEME : ${meme.download_url}`
                );

                if (!meme.download_url) {

                    throw new Error(
                        "L'image n'a pas de download_url."
                    );
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(0xff8c00)
                        .setTitle("😂 MEME")
                        .setImage(
                            meme.download_url
                        )
                        .setFooter({
                            text:
                                `DAVID BOT • ${meme.name}`
                        });

                await interaction.editReply({
                    embeds: [embed]
                });

                console.log(
                    "✅ MEME : envoyé avec succès"
                );

            } catch (error) {

                console.error(
                    "❌ MEME : erreur complète :",
                    error
                );

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle(
                                "❌ Impossible de récupérer un meme"
                            )
                            .setDescription(
                                "Une erreur est survenue pendant la récupération du meme depuis GitHub."
                            )
                            .setFooter({
                                text:
                                    "DAVID BOT • MEME"
                            })
                    ]
                });
            }

            return;
        }

        // ====================================================
        // WEB
        // ====================================================

        if (command === "web") {

            const button =
                new ButtonBuilder()
                    .setLabel("🌐 Ouvrir DAVID OFFICIEL")
                    .setStyle(ButtonStyle.Link)
                    .setURL(WEBSITE);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff66)
                        .setTitle("🌐 DAVID OFFICIEL")
                        .setDescription(
                            "Visite le site officiel de DAVID."
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // TIKTOK
        // ====================================================

        if (command === "tiktok") {

            const button =
                new ButtonBuilder()
                    .setLabel("🎵 Ouvrir TikTok")
                    .setStyle(ButtonStyle.Link)
                    .setURL(TIKTOK);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xff0050)
                        .setTitle("🎵 TIKTOK")
                        .setDescription(
                            "Retrouve DAVID sur TikTok."
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // NEOCITIES
        // ====================================================

        if (command === "neocities") {

            const button =
                new ButtonBuilder()
                    .setLabel("🌐 Neocities")
                    .setStyle(ButtonStyle.Link)
                    .setURL(NEOCITIES);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x39ff14)
                        .setTitle("🌐 NEOCITIES")
                        .setDescription(
                            "Page Neocities de DAVID OFFICIEL."
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // ROLE
        // ====================================================

        if (command === "role") {

            const roleName =
                interaction.options.getString("role");

            const roleId =
                ROLES[roleName];

            if (!roleId) {

                await interaction.reply({
                    content:
                        "❌ Rôle introuvable.",
                    ephemeral: true
                });

                return;
            }

            const guild =
                interaction.guild;

            if (!guild) {

                await interaction.reply({
                    content:
                        "❌ Cette commande doit être utilisée sur un serveur.",
                    ephemeral: true
                });

                return;
            }

            const role =
                guild.roles.cache.get(roleId);

            if (!role) {

                await interaction.reply({
                    content:
                        "❌ Ce rôle n'existe plus.",
                    ephemeral: true
                });

                return;
            }

            const botMember =
                guild.members.me;

            if (!botMember) {

                await interaction.reply({
                    content:
                        "❌ Impossible de trouver DAVID BOT.",
                    ephemeral: true
                });

                return;
            }

            if (
                !botMember.permissions.has(
                    PermissionFlagsBits.ManageRoles
                )
            ) {

                await interaction.reply({
                    content:
                        "❌ DAVID BOT n'a pas la permission **Gérer les rôles**.",
                    ephemeral: true
                });

                return;
            }

            if (
                role.position >=
                botMember.roles.highest.position
            ) {

                await interaction.reply({
                    content:
                        "❌ Le rôle de DAVID BOT doit être placé **au-dessus** de ce rôle.",
                    ephemeral: true
                });

                return;
            }

            const member =
                interaction.member;

            if (member.roles.cache.has(role.id)) {

                await member.roles.remove(
                    role,
                    "DAVID BOT - /role"
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xff5500)
                            .setTitle("🎭 RÔLE RETIRÉ")
                            .setDescription(
                                `Le rôle ${role} a été retiré.`
                            )
                    ]
                });

            } else {

                await member.roles.add(
                    role,
                    "DAVID BOT - /role"
                );

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x00ff66)
                            .setTitle("🎭 RÔLE AJOUTÉ")
                            .setDescription(
                                `Le rôle ${role} a été ajouté.`
                            )
                    ]
                });
            }

            return;
        }

        // ====================================================
        // BOTINFO
        // ====================================================

        if (command === "botinfo") {

            const memory =
                process.memoryUsage();

            const embed =
                new EmbedBuilder()
                    .setColor(0x5865f2)
                    .setTitle("🤖 DAVID BOT")
                    .setThumbnail(
                        avatar(client.user)
                    )
                    .addFields(
                        {
                            name: "👤 Nom",
                            value: client.user.tag,
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value: client.user.id,
                            inline: true
                        },
                        {
                            name: "🟢 Statut",
                            value: "ONLINE",
                            inline: true
                        },
                        {
                            name: "⏱️ Uptime",
                            value:
                                formatUptime(
                                    Date.now() -
                                    BOT_START_TIME
                                ),
                            inline: true
                        },
                        {
                            name: "📦 Discord.js",
                            value:
                                require("discord.js")
                                    .version,
                            inline: true
                        },
                        {
                            name: "🟢 Node.js",
                            value:
                                process.version,
                            inline: true
                        },
                        {
                            name: "💾 RAM",
                            value:
                                formatBytes(
                                    memory.rss
                                ),
                            inline: true
                        },
                        {
                            name: "🌐 Serveurs",
                            value:
                                String(
                                    client.guilds.cache.size
                                ),
                            inline: true
                        },
                        {
                            name: "📜 Commandes",
                            value:
                                String(
                                    commands.length
                                ),
                            inline: true
                        }
                    );

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("🌐 Site")
                            .setStyle(ButtonStyle.Link)
                            .setURL(WEBSITE),

                        new ButtonBuilder()
                            .setLabel("💻 GitHub")
                            .setStyle(ButtonStyle.Link)
                            .setURL(REPOSITORY)
                    );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        // ====================================================
        // UPTIME
        // ====================================================

        if (command === "uptime") {

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00ff66)
                        .setTitle("⏱️ DAVID BOT UPTIME")
                        .setDescription(
                            `DAVID BOT est en ligne depuis :\n\n**${formatUptime(Date.now() - BOT_START_TIME)}**`
                        )
                ]
            });

            return;
        }

        // ====================================================
        // INVITE
        // ====================================================

        if (command === "invite") {

            const invite =
                `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=268435456&scope=bot%20applications.commands`;

            const button =
                new ButtonBuilder()
                    .setLabel("🤖 Inviter DAVID BOT")
                    .setStyle(ButtonStyle.Link)
                    .setURL(invite);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setTitle("🤖 INVITER DAVID BOT")
                        .setDescription(
                            "Clique sur le bouton ci-dessous pour inviter le bot."
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // ROLES
        // ====================================================

        if (command === "roles") {

            const roles =
                interaction.guild.roles.cache
                    .sort(
                        (a, b) =>
                            b.position -
                            a.position
                    )
                    .map(role =>
                        `${role} — **${role.members.size}** membre(s)`
                    )
                    .slice(0, 50);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setTitle("🎭 RÔLES DU SERVEUR")
                        .setDescription(
                            roles.join("\n") ||
                            "Aucun rôle."
                        )
                ]
            });

            return;
        }

        // ====================================================
        // USERINFO
        // ====================================================

        if (command === "userinfo") {

            const user =
                interaction.options.getUser(
                    "user"
                ) ||
                interaction.user;

            const member =
                interaction.guild.members.cache.get(
                    user.id
                );

            const roleList =
                member
                    ? member.roles.cache
                        .filter(
                            role =>
                                role.id !==
                                interaction.guild.id
                        )
                        .map(role => role.toString())
                        .join(", ")
                    : "Non disponible";

            const embed =
                new EmbedBuilder()
                    .setColor(0x5865f2)
                    .setTitle("👤 USER INFO")
                    .setThumbnail(
                        avatar(user)
                    )
                    .addFields(
                        {
                            name: "👤 Utilisateur",
                            value: `${user}`,
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value: user.id,
                            inline: true
                        },
                        {
                            name: "🤖 Bot",
                            value:
                                user.bot
                                    ? "Oui"
                                    : "Non",
                            inline: true
                        },
                        {
                            name: "📅 Compte créé",
                            value:
                                `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
                            inline: false
                        },
                        {
                            name: "📥 Arrivé sur le serveur",
                            value:
                                member?.joinedTimestamp
                                    ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
                                    : "Inconnu",
                            inline: false
                        },
                        {
                            name: "🎭 Rôles",
                            value:
                                truncate(
                                    roleList,
                                    1000
                                ) ||
                                "Aucun",
                            inline: false
                        }
                    );

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // SERVERINFO
        // ====================================================

        if (command === "serverinfo") {

            const guild =
                interaction.guild;

            const embed =
                new EmbedBuilder()
                    .setColor(0x5865f2)
                    .setTitle(`🏠 ${guild.name}`)
                    .setThumbnail(
                        guild.iconURL({
                            extension: "png",
                            size: 256
                        })
                    )
                    .addFields(
                        {
                            name: "👑 Propriétaire",
                            value:
                                `<@${guild.ownerId}>`,
                            inline: true
                        },
                        {
                            name: "👥 Membres",
                            value:
                                String(
                                    guild.memberCount
                                ),
                            inline: true
                        },
                        {
                            name: "🎭 Rôles",
                            value:
                                String(
                                    guild.roles.cache.size
                                ),
                            inline: true
                        },
                        {
                            name: "💬 Salons",
                            value:
                                String(
                                    guild.channels.cache.size
                                ),
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value:
                                guild.id,
                            inline: true
                        },
                        {
                            name: "📅 Création",
                            value:
                                `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                            inline: false
                        },
                        {
                            name: "🚀 Boost",
                            value:
                                `Niveau ${guild.premiumTier} • ${guild.premiumSubscriptionCount || 0} boost(s)`,
                            inline: true
                        }
                    );

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // COINFLIP
        // ====================================================

        if (command === "coinflip") {

            const result =
                Math.random() < 0.5
                    ? "PILE 🪙"
                    : "FACE 🪙";

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffd700)
                        .setTitle("🪙 COINFLIP")
                        .setDescription(
                            `La pièce tombe sur...\n\n# ${result}`
                        )
                ]
            });

            return;
        }

        // ====================================================
        // DICE
        // ====================================================

        if (command === "dice") {

            const faces =
                interaction.options.getInteger(
                    "faces"
                ) || 6;

            const result =
                Math.floor(
                    Math.random() * faces
                ) + 1;

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setTitle("🎲 DICE")
                        .setDescription(
                            `🎲 Dé à **${faces}** faces\n\n# ${result}`
                        )
                ]
            });

            return;
        }

        // ====================================================
        // SHIP
        // ====================================================

        if (command === "ship") {

            const user1 =
                interaction.options.getUser(
                    "user1"
                );

            const user2 =
                interaction.options.getUser(
                    "user2"
                );

            const percentage =
                Math.floor(
                    Math.random() * 101
                );

            let hearts;

            if (percentage < 20) {
                hearts = "💔";
            } else if (percentage < 40) {
                hearts = "❤️";
            } else if (percentage < 60) {
                hearts = "💗";
            } else if (percentage < 80) {
                hearts = "💖";
            } else {
                hearts = "💘";
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xff69b4)
                        .setTitle("❤️ LOVE CALCULATOR")
                        .setDescription(
                            `${user1} ❤️ ${user2}\n\n# ${percentage}% ${hearts}`
                        )
                ]
            });

            return;
        }

        // ====================================================
        // SAY
        // ====================================================

        if (command === "say") {

            const message =
                interaction.options.getString(
                    "message"
                );

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x5865f2)
                        .setDescription(message)
                        .setFooter({
                            text:
                                `DAVID BOT • ${interaction.user.username}`
                        })
                ]
            });

            return;
        }

        // ====================================================
        // TTS
        // ====================================================

        if (command === "tts") {

            const text =
                interaction.options.getString(
                    "texte"
                );

            const encoded =
                encodeURIComponent(
                    text
                );

            const url =
                `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encoded}&tl=fr`;

            const button =
                new ButtonBuilder()
                    .setLabel("🔊 Écouter le TTS")
                    .setStyle(ButtonStyle.Link)
                    .setURL(url);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x00aaff)
                        .setTitle("🔊 TEXT TO SPEECH")
                        .setDescription(
                            `Texte :\n> ${truncate(text, 500)}`
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // REPO
        // ====================================================

        if (command === "repo") {

            const button =
                new ButtonBuilder()
                    .setLabel("💻 GitHub")
                    .setStyle(ButtonStyle.Link)
                    .setURL(REPOSITORY);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x24292e)
                        .setTitle("💻 DAVID BOT — GITHUB")
                        .setDescription(
                            "Code source du bot."
                        )
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(button)
                ]
            });

            return;
        }

        // ====================================================
        // QR
        // ====================================================

        if (command === "qr") {

            const text =
                interaction.options.getString(
                    "texte"
                );

            const encoded =
                encodeURIComponent(
                    text
                );

            const qr =
                `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encoded}`;

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffffff)
                        .setTitle("📱 QR CODE")
                        .setDescription(
                            `Contenu :\n\`${truncate(text, 500)}\``
                        )
                        .setImage(qr)
                ]
            });

            return;
        }

        // ====================================================
        // IP
        // ====================================================

        if (command === "ip") {

            await interaction.deferReply();

            const input =
                interaction.options.getString(
                    "adresse"
                ).trim();

            try {

                let host = input;
                let port = null;

                // --------------------------------------------
                // IPv4:PORT ou domaine:PORT
                // --------------------------------------------

                const portMatch =
                    input.match(
                        /^(.+):(\d+)$/
                    );

                if (portMatch) {

                    host =
                        portMatch[1];

                    port =
                        Number(
                            portMatch[2]
                        );

                    if (
                        port < 1 ||
                        port > 65535
                    ) {

                        throw new Error(
                            "Port invalide."
                        );
                    }
                }

                const ipv4 =
                    /^(\d{1,3}\.){3}\d{1,3}$/;

                let ip = host;

                // --------------------------------------------
                // DNS
                // --------------------------------------------

                if (!ipv4.test(host)) {

                    console.log(
                        `🌐 IP : résolution DNS → ${host}`
                    );

                    const dnsResponse =
                        await fetch(
                            `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`,
                            {
                                headers: {
                                    "User-Agent":
                                        "DAVID-BOT"
                                }
                            }
                        );

                    if (!dnsResponse.ok) {
                        throw new Error(
                            "Impossible de résoudre le domaine."
                        );
                    }

                    const dnsData =
                        await dnsResponse.json();

                    const answer =
                        dnsData.Answer?.find(
                            item =>
                                item.type === 1
                        );

                    if (!answer) {
                        throw new Error(
                            "Aucune adresse IPv4 trouvée."
                        );
                    }

                    ip = answer.data;
                }

                // --------------------------------------------
                // Validation IPv4
                // --------------------------------------------

                if (!ipv4.test(ip)) {

                    throw new Error(
                        "Adresse IPv4 invalide."
                    );
                }

                const octets =
                    ip.split(".").map(Number);

                if (
                    octets.some(
                        value =>
                            value < 0 ||
                            value > 255
                    )
                ) {

                    throw new Error(
                        "Adresse IPv4 invalide."
                    );
                }

                // --------------------------------------------
                // IP PRIVÉE
                // --------------------------------------------

                const privateIP =
                    ip.startsWith("10.") ||
                    ip.startsWith("192.168.") ||
                    (
                        ip.startsWith("172.") &&
                        octets[1] >= 16 &&
                        octets[1] <= 31
                    ) ||
                    ip.startsWith("127.");

                // --------------------------------------------
                // Géolocalisation
                // --------------------------------------------

                let geo = null;

                if (!privateIP) {

                    const geoResponse =
                        await fetch(
                            `https://ipwho.is/${ip}`,
                            {
                                headers: {
                                    "User-Agent":
                                        "DAVID-BOT"
                                }
                            }
                        );

                    if (geoResponse.ok) {
                        geo =
                            await geoResponse.json();
                    }
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            privateIP
                                ? 0xffaa00
                                : 0x00aaff
                        )
                        .setTitle("🌍 IP INFORMATION")
                        .addFields(
                            {
                                name: "🌐 IP",
                                value:
                                    `\`${ip}\``,
                                inline: true
                            },
                            {
                                name: "🎮 Port",
                                value:
                                    port
                                        ? `\`${port}\``
                                        : "Non spécifié",
                                inline: true
                            },
                            {
                                name: "🔒 Type",
                                value:
                                    privateIP
                                        ? "IP privée"
                                        : "IP publique",
                                inline: true
                            }
                        );

                if (geo && geo.success !== false) {

                    embed.addFields(
                        {
                            name: "🏙️ Ville",
                            value:
                                geo.city ||
                                "Inconnue",
                            inline: true
                        },
                        {
                            name: "📍 Région",
                            value:
                                geo.region ||
                                "Inconnue",
                            inline: true
                        },
                        {
                            name: "🌎 Pays",
                            value:
                                geo.country ||
                                "Inconnu",
                            inline: true
                        },
                        {
                            name: "📡 ISP",
                            value:
                                truncate(
                                    geo.connection?.isp ||
                                    "Inconnu",
                                    100
                                ),
                            inline: true
                        },
                        {
                            name: "🏢 Organisation",
                            value:
                                truncate(
                                    geo.connection?.org ||
                                    "Inconnue",
                                    100
                                ),
                            inline: true
                        }
                    );

                    if (
                        geo.latitude != null &&
                        geo.longitude != null
                    ) {

                        embed.addFields({
                            name: "📌 Coordonnées",
                            value:
                                `${geo.latitude}, ${geo.longitude}`,
                            inline: true
                        });
                    }
                }

                embed.setFooter({
                    text:
                        "DAVID BOT • IP"
                });

                await interaction.editReply({
                    embeds: [embed]
                });

            } catch (error) {

                console.error(
                    "❌ IP :",
                    error
                );

                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0xff0000)
                            .setTitle("❌ Erreur IP")
                            .setDescription(
                                `Impossible d'analyser cette adresse.\n\n\`${truncate(error.message, 500)}\``
                            )
                    ]
                });
            }

            return;
        }

        // ====================================================
        // COMMANDE INCONNUE
        // ====================================================

        console.log(
            `⚠️ Commande inconnue : ${command}`
        );

    } catch (error) {

        console.error(
            `❌ Erreur /${command} :`,
            error
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Une erreur est survenue.",
                    ephemeral: true
                });

            } else if (interaction.deferred) {

                await interaction.editReply({
                    content:
                        "❌ Une erreur est survenue."
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Une erreur est survenue.",
                    ephemeral: true
                });
            }

        } catch (replyError) {

            console.error(
                "❌ Impossible d'envoyer le message d'erreur :",
                replyError.message
            );
        }
    }
});

// ============================================================
// PREFIX COMMAND
// ============================================================

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    if (message.content === "!ping") {

        const latency =
            Date.now() -
            message.createdTimestamp;

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x00ff66)
                    .setTitle("🏓 PONG")
                    .setDescription(
                        "DAVID BOT fonctionne correctement."
                    )
                    .addFields(
                        {
                            name: "📡 Latence",
                            value:
                                `${latency} ms`,
                            inline: true
                        },
                        {
                            name: "💓 WebSocket",
                            value:
                                `${client.ws.ping} ms`,
                            inline: true
                        }
                    )
            ]
        });
    }
});

// ============================================================
// LOGIN
// ============================================================

if (!TOKEN) {

    console.error(
        "❌ DISCORD_TOKEN n'est pas défini dans les variables d'environnement."
    );

    process.exit(1);
}

client.login(TOKEN);
