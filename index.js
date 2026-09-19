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
// DAVID BOT - CONFIGURATION
// ============================================================

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

const REPOSITORY =
    "https://github.com/davidtytytutu-lgtm/david-bot";

const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 10000;

const RGB_DELAY = 5000;

const BOT_START_TIME = Date.now();

// ============================================================
// ROLES
// ============================================================

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};

// ============================================================
// RGB NAMES
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

// ============================================================
// CLIENT
// ============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ============================================================
// COULEURS EMBEDS
// ============================================================

const COLORS = {
    red: 0xff3b30,
    orange: 0xff9500,
    yellow: 0xffcc00,
    green: 0x34c759,
    blue: 0x007aff,
    purple: 0xaf52de,
    pink: 0xff2d55,
    cyan: 0x00d4ff,
    dark: 0x111111,
    white: 0xffffff
};

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
    if (seconds || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
}

function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    let i = 0;
    let value = bytes;

    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i++;
    }

    return `${value.toFixed(2)} ${units[i]}`;
}

function getBar(value, max, length = 12) {
    const ratio = Math.max(0, Math.min(1, value / max));
    const filled = Math.round(ratio * length);

    return "█".repeat(filled) + "░".repeat(length - filled);
}

function truncate(text, length = 1000) {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.substring(0, length - 3) + "...";
}

function avatar(user, size = 256) {
    return user.displayAvatarURL({
        extension: "png",
        size
    });
}

// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer((req, res) => {

    if (req.url === "/heartbeat") {

        console.log("💓 HEARTBEAT REÇU SUR DAVID BOT");

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            status: "ok",
            heartbeat: true,
            from: "DAVID-BOT"
        }));

        return;
    }

    if (req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>DAVID BOT</title>
<style>
body{
    background:#050505;
    color:#00ff66;
    font-family:monospace;
    text-align:center;
    padding-top:80px;
}
.box{
    border:1px solid #00ff66;
    padding:30px;
    max-width:600px;
    margin:auto;
    box-shadow:0 0 25px #00ff6633;
}
h1{
    letter-spacing:5px;
}
</style>
</head>
<body>
<div class="box">
<h1>DAVID BOT</h1>
<p>ONLINE</p>
<p>Discord Bot Server</p>
<p>Heartbeat: ACTIVE</p>
</div>
</body>
</html>
        `);

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain"
    });

    res.end("404");
});

server.listen(process.env.PORT || 10000, () => {
    console.log(
        `🌐 Serveur HTTP démarré sur le port ${process.env.PORT || 10000}`
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
// SLASH COMMANDS
// ============================================================

const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🏓 Vérifie la latence de DAVID BOT"),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("📖 Affiche toutes les commandes de DAVID BOT"),

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription("😈 Rickroll quelqu'un"),

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription("😂 Affiche un meme"),

    new SlashCommandBuilder()
        .setName("web")
        .setDescription("🌐 Affiche le site officiel"),

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription("🎵 Affiche le TikTok"),

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription("🌐 Affiche le Neocities"),

    new SlashCommandBuilder()
        .setName("role")
        .setDescription("🎭 Donne un rôle spécial")
        .addStringOption(option =>
            option
                .setName("role")
                .setDescription("Rôle à donner")
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

    new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("🤖 Informations sur DAVID BOT"),

    new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("⏱️ Affiche le temps depuis lequel DAVID BOT fonctionne"),

    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("🔗 Lien d'invitation de DAVID BOT"),

    new SlashCommandBuilder()
        .setName("roles")
        .setDescription("🎭 Affiche les rôles du serveur"),

    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("👤 Informations sur un utilisateur")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Utilisateur")
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("🖥️ Informations sur le serveur"),

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("🪙 Lance une pièce"),

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription("🎲 Lance un dé")
        .addIntegerOption(option =>
            option
                .setName("faces")
                .setDescription("Nombre de faces")
                .setMinValue(2)
                .setMaxValue(1000)
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription("❤️ Calcule un pourcentage")
        .addUserOption(option =>
            option
                .setName("user1")
                .setDescription("Première personne")
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("user2")
                .setDescription("Deuxième personne")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("say")
        .setDescription("💬 Fait parler le bot")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("tts")
        .setDescription("🔊 Prépare un message TTS")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Texte")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("repo")
        .setDescription("💻 Affiche le GitHub de DAVID BOT"),

    new SlashCommandBuilder()
        .setName("qr")
        .setDescription("🔳 Génère un QR code")
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription("Texte ou URL")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("ip")
        .setDescription("🌍 Analyse une adresse IP ou un serveur")
        .addStringOption(option =>
            option
                .setName("adresse")
                .setDescription("IP, domaine ou adresse avec port")
                .setRequired(true)
        )

].map(command => command.toJSON());

// ============================================================
// READY
// ============================================================

client.once("clientReady", async () => {

    console.log(
        `🤖 DAVID BOT connecté en tant que ${client.user.tag}`
    );

    // --------------------------------------------------------
    // SUPPRESSION DES ANCIENNES COMMANDES DE SERVEUR
    // --------------------------------------------------------

    try {

        const guild = await client.guilds.fetch(GUILD_ID);

        await guild.commands.set([]);

        console.log(
            "🧹 Anciennes commandes de serveur supprimées."
        );

    } catch (error) {

        console.error(
            "⚠️ Impossible de nettoyer les commandes de serveur :",
            error.message
        );
    }

    // --------------------------------------------------------
    // COMMANDES GLOBALES
    // --------------------------------------------------------

    try {

        await client.application.commands.set(commands);

        console.log(
            `✅ ${commands.length} commandes globales enregistrées !`
        );

    } catch (error) {

        console.error(
            "❌ Erreur enregistrement commandes :",
            error
        );
    }

    // --------------------------------------------------------
    // RGB
    // --------------------------------------------------------

    try {

        const guild = await client.guilds.fetch(GUILD_ID);

        console.log(
            `🌈 RGB : serveur trouvé → ${guild.name}`
        );

        const botMember =
            await guild.members.fetch(client.user.id);

        console.log(
            `🌈 RGB : membre trouvé → ${botMember.user.tag}`
        );

        // IMPORTANT :
        // On NE vérifie PAS botMember.manageable.
        // Le bot peut modifier son propre surnom.
        // On tente directement l'opération.

        const changeRGBName = async () => {

            try {

                const newName =
                    RGB_NAMES[rgbIndex];

                console.log(
                    `🌈 Changement du nom → ${newName}`
                );

                await botMember.setNickname(newName);

                console.log(
                    `✅ Nom changé → ${newName}`
                );

                rgbIndex =
                    (rgbIndex + 1) %
                    RGB_NAMES.length;

            } catch (error) {

                console.error(
                    "❌ Erreur RGB Discord :",
                    error.message
                );

                if (error.code) {
                    console.error(
                        `❌ Code Discord : ${error.code}`
                    );
                }
            }
        };

        await changeRGBName();

        setInterval(
            changeRGBName,
            RGB_DELAY
        );

    } catch (error) {

        console.error(
            "❌ Erreur initialisation RGB :",
            error
        );
    }

    // --------------------------------------------------------
    // HEARTBEAT
    // --------------------------------------------------------

    setTimeout(() => {

        console.log(
            "💓 Démarrage du système heartbeat..."
        );

        sendHeartbeatToServer();

    }, 5000);
});

// ============================================================
// INTERACTIONS
// ============================================================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command = interaction.commandName;

    try {

        // ====================================================
        // /PING
        // ====================================================

        if (command === "ping") {

            const sent =
                await interaction.reply({
                    content: "🏓 Calcul de la latence...",
                    fetchReply: true
                });

            const latency =
                sent.createdTimestamp -
                interaction.createdTimestamp;

            const ws =
                client.ws.ping;

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.green)
                    .setTitle("🏓 PONG !")
                    .setDescription(
                        "DAVID BOT répond correctement."
                    )
                    .addFields(
                        {
                            name: "📡 Latence",
                            value: `\`${latency} ms\``,
                            inline: true
                        },
                        {
                            name: "🌐 WebSocket",
                            value: `\`${ws} ms\``,
                            inline: true
                        },
                        {
                            name: "🟢 État",
                            value: "`ONLINE`",
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "DAVID BOT • Diagnostic"
                    });

            await interaction.editReply({
                content: "",
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /HELP
        // ====================================================

        if (command === "help") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.cyan)
                    .setTitle("📖 DAVID BOT // COMMAND CENTER")
                    .setDescription(
                        "Voici toutes les commandes disponibles."
                    )
                    .addFields(
                        {
                            name: "🛠️ Informations",
                            value:
                                "`/botinfo` • Informations du bot\n" +
                                "`/serverinfo` • Informations serveur\n" +
                                "`/userinfo` • Informations utilisateur\n" +
                                "`/roles` • Liste des rôles\n" +
                                "`/uptime` • Temps de fonctionnement\n" +
                                "`/ping` • Latence"
                        },
                        {
                            name: "🌐 Internet",
                            value:
                                "`/ip` • Analyse IP / domaine\n" +
                                "`/web` • Site officiel\n" +
                                "`/neocities` • Neocities\n" +
                                "`/tiktok` • TikTok\n" +
                                "`/repo` • GitHub\n" +
                                "`/qr` • QR Code"
                        },
                        {
                            name: "🎮 Fun",
                            value:
                                "`/meme` • Meme\n" +
                                "`/rick-roll` • Rickroll\n" +
                                "`/coinflip` • Pile ou face\n" +
                                "`/dice` • Dé\n" +
                                "`/ship` • Compatibilité"
                        },
                        {
                            name: "🔧 Utilitaires",
                            value:
                                "`/role` • Donner un rôle\n" +
                                "`/say` • Faire parler le bot\n" +
                                "`/tts` • Message TTS\n" +
                                "`/invite` • Invitation"
                        }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter({
                        text: `DAVID BOT • ${commands.length} commandes`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /BOTINFO
        // ====================================================

        if (command === "botinfo") {

            const memory =
                process.memoryUsage();

            const uptime =
                formatUptime(
                    Date.now() - BOT_START_TIME
                );

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.purple)
                    .setTitle("🤖 DAVID BOT // SYSTEM INFO")
                    .setThumbnail(
                        client.user.displayAvatarURL({
                            size: 512
                        })
                    )
                    .setDescription(
                        "Informations techniques sur DAVID BOT."
                    )
                    .addFields(
                        {
                            name: "🤖 Nom",
                            value: `\`${client.user.username}\``,
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value: `\`${client.user.id}\``,
                            inline: true
                        },
                        {
                            name: "📡 Statut",
                            value: "🟢 ONLINE",
                            inline: true
                        },
                        {
                            name: "⏱️ Uptime",
                            value: `\`${uptime}\``,
                            inline: true
                        },
                        {
                            name: "📚 Discord.js",
                            value: "`v14`",
                            inline: true
                        },
                        {
                            name: "⚙️ Node.js",
                            value: `\`${process.version}\``,
                            inline: true
                        },
                        {
                            name: "💾 RAM",
                            value:
                                `\`${formatBytes(memory.rss)}\``,
                            inline: true
                        },
                        {
                            name: "🖥️ Serveurs",
                            value:
                                `\`${client.guilds.cache.size}\``,
                            inline: true
                        },
                        {
                            name: "⚡ Commandes",
                            value:
                                `\`${commands.length}\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "DAVID BOT • System Monitor"
                    });

            const buttons =
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
                components: [buttons]
            });

            return;
        }

        // ====================================================
        // /SERVERINFO
        // ====================================================

        if (command === "serverinfo") {

            const guild =
                interaction.guild;

            const owner =
                await guild.fetchOwner();

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.blue)
                    .setTitle(
                        `🖥️ ${guild.name} // SERVER INFO`
                    )
                    .setThumbnail(
                        guild.iconURL({
                            extension: "png",
                            size: 512
                        })
                    )
                    .addFields(
                        {
                            name: "👑 Propriétaire",
                            value: `<@${owner.id}>`,
                            inline: true
                        },
                        {
                            name: "👥 Membres",
                            value:
                                `\`${guild.memberCount}\``,
                            inline: true
                        },
                        {
                            name: "🎭 Rôles",
                            value:
                                `\`${guild.roles.cache.size}\``,
                            inline: true
                        },
                        {
                            name: "💬 Salons",
                            value:
                                `\`${guild.channels.cache.size}\``,
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value:
                                `\`${guild.id}\``,
                            inline: true
                        },
                        {
                            name: "📅 Créé le",
                            value:
                                `<t:${Math.floor(
                                    guild.createdTimestamp / 1000
                                )}:D>`,
                            inline: true
                        },
                        {
                            name: "🚀 Niveau de boost",
                            value:
                                `\`${guild.premiumTier}\``,
                            inline: true
                        },
                        {
                            name: "💎 Boosts",
                            value:
                                `\`${guild.premiumSubscriptionCount || 0}\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "DAVID BOT • Server Scanner"
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /USERINFO
        // ====================================================

        if (command === "userinfo") {

            const user =
                interaction.options.getUser("user") ||
                interaction.user;

            const member =
                interaction.guild
                    ? await interaction.guild.members
                        .fetch(user.id)
                        .catch(() => null)
                    : null;

            const roles =
                member
                    ? member.roles.cache
                        .filter(role => role.id !== interaction.guild.id)
                        .map(role => role.toString())
                        .slice(0, 10)
                        .join(" ") || "Aucun"
                    : "Non disponible";

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.pink)
                    .setTitle(
                        `👤 ${user.username} // USER INFO`
                    )
                    .setThumbnail(
                        avatar(user, 512)
                    )
                    .addFields(
                        {
                            name: "👤 Utilisateur",
                            value: `<@${user.id}>`,
                            inline: true
                        },
                        {
                            name: "🆔 ID",
                            value: `\`${user.id}\``,
                            inline: true
                        },
                        {
                            name: "🤖 Bot",
                            value: user.bot ? "Oui" : "Non",
                            inline: true
                        },
                        {
                            name: "📅 Compte créé",
                            value:
                                `<t:${Math.floor(
                                    user.createdTimestamp / 1000
                                )}:D>`,
                            inline: true
                        },
                        {
                            name: "📥 A rejoint",
                            value:
                                member?.joinedTimestamp
                                    ? `<t:${Math.floor(
                                        member.joinedTimestamp / 1000
                                    )}:D>`
                                    : "Inconnu",
                            inline: true
                        },
                        {
                            name: "🎭 Rôles",
                            value: truncate(roles, 1000),
                            inline: false
                        }
                    )
                    .setFooter({
                        text: "DAVID BOT • User Scanner"
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /ROLES
        // ====================================================

        if (command === "roles") {

            const roles =
                interaction.guild.roles.cache
                    .sort((a, b) => b.position - a.position)
                    .filter(role => role.id !== interaction.guild.id);

            const list =
                roles
                    .map(role =>
                        `${role.toString()} — \`${role.members.size}\` membre(s)`
                    )
                    .slice(0, 25)
                    .join("\n") || "Aucun rôle.";

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.orange)
                    .setTitle("🎭 SERVER ROLES")
                    .setDescription(list)
                    .setFooter({
                        text: `${roles.size} rôle(s)`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /UPTIME
        // ====================================================

        if (command === "uptime") {

            const uptime =
                Date.now() - BOT_START_TIME;

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.green)
                    .setTitle("⏱️ DAVID BOT // UPTIME")
                    .setDescription(
                        "Le système fonctionne actuellement."
                    )
                    .addFields(
                        {
                            name: "🟢 Statut",
                            value: "`ONLINE`",
                            inline: true
                        },
                        {
                            name: "⏱️ Temps actif",
                            value:
                                `\`${formatUptime(uptime)}\``,
                            inline: true
                        },
                        {
                            name: "📡 Ping",
                            value:
                                `\`${client.ws.ping} ms\``,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: "DAVID BOT • Runtime Monitor"
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /WEB
        // ====================================================

        if (command === "web") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.cyan)
                    .setTitle("🌐 DAVID OFFICIEL")
                    .setDescription(
                        "Le site officiel de David."
                    )
                    .setURL(WEBSITE);

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("🌐 Ouvrir le site")
                            .setStyle(ButtonStyle.Link)
                            .setURL(WEBSITE)
                    );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        // ====================================================
        // /TIKTOK
        // ====================================================

        if (command === "tiktok") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.pink)
                    .setTitle("🎵 TIKTOK")
                    .setDescription(
                        "Retrouve David sur TikTok."
                    )
                    .setURL(TIKTOK);

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("🎵 Ouvrir TikTok")
                            .setStyle(ButtonStyle.Link)
                            .setURL(TIKTOK)
                    );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        // ====================================================
        // /NEOCITIES
        // ====================================================

        if (command === "neocities") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.purple)
                    .setTitle("🌐 NEOCITIES")
                    .setDescription(
                        "Page Neocities de DAVID OFFICIEL."
                    )
                    .setURL(NEOCITIES);

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("🌐 Neocities")
                            .setStyle(ButtonStyle.Link)
                            .setURL(NEOCITIES)
                    );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        // ====================================================
        // /REPO
        // ====================================================

        if (command === "repo") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.dark)
                    .setTitle("💻 DAVID BOT // GITHUB")
                    .setDescription(
                        "Code source du bot Discord."
                    )
                    .setURL(REPOSITORY);

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("💻 Ouvrir GitHub")
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
        // /INVITE
        // ====================================================

        if (command === "invite") {

            const invite =
                `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=268435456&scope=bot%20applications.commands`;

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.blue)
                    .setTitle("🔗 INVITER DAVID BOT")
                    .setDescription(
                        "Clique sur le bouton pour ajouter DAVID BOT à un serveur."
                    );

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("➕ Inviter DAVID BOT")
                            .setStyle(ButtonStyle.Link)
                            .setURL(invite)
                    );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            return;
        }

        // ====================================================
        // /COINFLIP
        // ====================================================

        if (command === "coinflip") {

            const result =
                Math.random() < 0.5
                    ? "PILE"
                    : "FACE";

            const emoji =
                result === "PILE"
                    ? "🪙"
                    : "🔵";

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.yellow)
                    .setTitle("🪙 COINFLIP")
                    .setDescription(
                        `# ${emoji} ${result}`
                    )
                    .setFooter({
                        text: `Lancé par ${interaction.user.username}`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /DICE
        // ====================================================

        if (command === "dice") {

            const faces =
                interaction.options.getInteger("faces") || 6;

            const result =
                Math.floor(
                    Math.random() * faces
                ) + 1;

            const bar =
                getBar(result, faces, 16);

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.orange)
                    .setTitle("🎲 DICE // ROLL")
                    .setDescription(
                        `# 🎲 ${result}\n\n` +
                        `\`${bar}\``
                    )
                    .addFields({
                        name: "Faces",
                        value: `\`${faces}\``,
                        inline: true
                    })
                    .setFooter({
                        text: `Lancé par ${interaction.user.username}`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /SHIP
        // ====================================================

        if (command === "ship") {

            const user1 =
                interaction.options.getUser("user1");

            const user2 =
                interaction.options.getUser("user2");

            const percentage =
                Math.floor(
                    Math.random() * 101
                );

            const filled =
                Math.round(
                    percentage / 10
                );

            const bar =
                "❤️".repeat(filled) +
                "🖤".repeat(10 - filled);

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.pink)
                    .setTitle("💘 LOVE CALCULATOR")
                    .setDescription(
                        `${user1} 💕 ${user2}\n\n` +
                        `**${percentage}%**\n\n` +
                        bar
                    )
                    .setFooter({
                        text: "Attention : calcul totalement scientifique™"
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /RICK-ROLL
        // ====================================================

        if (command === "rick-roll") {

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.red)
                    .setTitle("😈 YOU'VE BEEN RICKROLLED")
                    .setImage(RICK_ROLL_GIF)
                    .setDescription(
                        "Never gonna give you up..."
                    );

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /MEME
        // ====================================================

        if (command === "meme") {

            await interaction.deferReply();

            try {

                const response =
                    await fetch(
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

                const files =
                    await response.json();

                const images =
                    files.filter(file =>
                        /\.(png|jpg|jpeg|gif|webp)$/i
                            .test(file.name)
                    );

                if (!images.length) {

                    await interaction.editReply({
                        content:
                            "❌ Aucun meme trouvé dans le dossier GitHub."
                    });

                    return;
                }

                const selected =
                    images[
                        Math.floor(
                            Math.random() *
                            images.length
                        )
                    ];

                const embed =
                    new EmbedBuilder()
                        .setColor(COLORS.yellow)
                        .setTitle("😂 MEME")
                        .setImage(selected.download_url)
                        .setFooter({
                            text: `Source : ${selected.name}`
                        });

                await interaction.editReply({
                    embeds: [embed]
                });

            } catch (error) {

                console.error(
                    "❌ Meme error:",
                    error
                );

                await interaction.editReply({
                    content:
                        "❌ Impossible de récupérer un meme."
                });
            }

            return;
        }

        // ====================================================
        // /ROLE
        // ====================================================

        if (command === "role") {

            const roleName =
                interaction.options.getString("role");

            const roleId =
                ROLES[roleName];

            if (!roleId) {

                await interaction.reply({
                    content: "❌ Rôle invalide.",
                    ephemeral: true
                });

                return;
            }

            const role =
                interaction.guild.roles.cache.get(
                    roleId
                );

            if (!role) {

                await interaction.reply({
                    content:
                        "❌ Ce rôle n'existe pas sur ce serveur.",
                    ephemeral: true
                });

                return;
            }

            const member =
                interaction.member;

            if (
                !interaction.guild.members.me.permissions
                    .has(PermissionFlagsBits.ManageRoles)
            ) {

                await interaction.reply({
                    content:
                        "❌ DAVID BOT n'a pas la permission `Gérer les rôles`.",
                    ephemeral: true
                });

                return;
            }

            if (member.roles.cache.has(role.id)) {

                await member.roles.remove(role);

                const embed =
                    new EmbedBuilder()
                        .setColor(COLORS.red)
                        .setTitle("🎭 RÔLE RETIRÉ")
                        .setDescription(
                            `${role} a été retiré.`
                        );

                await interaction.reply({
                    embeds: [embed]
                });

            } else {

                if (
                    role.position >=
                    interaction.guild.members.me.roles.highest.position
                ) {

                    await interaction.reply({
                        content:
                            "❌ DAVID BOT ne peut pas gérer ce rôle car il est placé trop haut.",
                        ephemeral: true
                    });

                    return;
                }

                await member.roles.add(role);

                const embed =
                    new EmbedBuilder()
                        .setColor(COLORS.green)
                        .setTitle("🎭 RÔLE AJOUTÉ")
                        .setDescription(
                            `${role} a été ajouté.`
                        );

                await interaction.reply({
                    embeds: [embed]
                });
            }

            return;
        }

        // ====================================================
        // /SAY
        // ====================================================

        if (command === "say") {

            const message =
                interaction.options.getString("message");

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.cyan)
                    .setDescription(message)
                    .setFooter({
                        text:
                            `Message envoyé par ${interaction.user.username}`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /TTS
        // ====================================================

        if (command === "tts") {

            const message =
                interaction.options.getString("message");

            const encoded =
                encodeURIComponent(message);

            const url =
                `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encoded}&tl=fr`;

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.purple)
                    .setTitle("🔊 TTS")
                    .setDescription(
                        `> ${truncate(message, 1000)}`
                    )
                    .addFields({
                        name: "🎧 Audio",
                        value:
                            `[▶️ Ouvrir le TTS](${url})`
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /QR
        // ====================================================

        if (command === "qr") {

            const text =
                interaction.options.getString("texte");

            const qrURL =
                `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(text)}`;

            const embed =
                new EmbedBuilder()
                    .setColor(COLORS.white)
                    .setTitle("🔳 QR CODE")
                    .setDescription(
                        `Contenu :\n\`${truncate(text, 500)}\``
                    )
                    .setImage(qrURL)
                    .setFooter({
                        text: "DAVID BOT • QR Generator"
                    });

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        // ====================================================
        // /IP
        // ====================================================

        if (command === "ip") {

            await interaction.deferReply();

            const original =
                interaction.options.getString(
                    "adresse"
                ).trim();

            let host = original;
            let port = null;

            // ------------------------------------------------
            // EXTRACTION DU PORT
            // ------------------------------------------------

            const hostPortMatch =
                host.match(
                    /^(.+):(\d+)$/
                );

            if (hostPortMatch) {

                host =
                    hostPortMatch[1];

                port =
                    Number(
                        hostPortMatch[2]
                    );

                if (
                    port < 1 ||
                    port > 65535
                ) {

                    await interaction.editReply({
                        content:
                            "❌ Port invalide. Utilise un port entre `1` et `65535`."
                    });

                    return;
                }
            }

            // ------------------------------------------------
            // VALIDATION IP
            // ------------------------------------------------

            const ipv4Regex =
                /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

            const isIP =
                ipv4Regex.test(host);

            const privateIP =
                isIP && (
                    host.startsWith("10.") ||
                    host.startsWith("192.168.") ||
                    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
                    host === "127.0.0.1"
                );

            // ------------------------------------------------
            // DNS
            // ------------------------------------------------

            let resolvedIP = host;

            if (!isIP) {

                try {

                    const dnsResponse =
                        await fetch(
                            `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`
                        );

                    const dnsData =
                        await dnsResponse.json();

                    const record =
                        dnsData.Answer?.find(
                            answer =>
                                answer.type === 1
                        );

                    if (!record) {

                        await interaction.editReply({
                            content:
                                `❌ Impossible de résoudre \`${host}\`.`
                        });

                        return;
                    }

                    resolvedIP =
                        record.data;

                } catch (error) {

                    await interaction.editReply({
                        content:
                            `❌ Erreur DNS : ${error.message}`
                    });

                    return;
                }
            }

            // ------------------------------------------------
            // IP PRIVÉE
            // ------------------------------------------------

            if (privateIP) {

                const embed =
                    new EmbedBuilder()
                        .setColor(COLORS.orange)
                        .setTitle("🔒 IP PRIVÉE")
                        .setDescription(
                            "Cette adresse appartient à un réseau privé."
                        )
                        .addFields(
                            {
                                name: "📍 Adresse",
                                value: `\`${host}\``,
                                inline: true
                            },
                            {
                                name: "🔌 Port",
                                value:
                                    port
                                        ? `\`${port}\``
                                        : "`Non spécifié`",
                                inline: true
                            },
                            {
                                name: "🌐 Type",
                                value: "`PRIVATE IPv4`",
                                inline: true
                            }
                        );

                await interaction.editReply({
                    embeds: [embed]
                });

                return;
            }

            // ------------------------------------------------
            // GEO IP
            // ------------------------------------------------

            try {

                const geoResponse =
                    await fetch(
                        `https://ipwho.is/${encodeURIComponent(resolvedIP)}`
                    );

                const geo =
                    await geoResponse.json();

                if (!geo.success) {
                    throw new Error(
                        geo.message ||
                        "IP inconnue"
                    );
                }

                const embed =
                    new EmbedBuilder()
                        .setColor(COLORS.cyan)
                        .setTitle("🌍 IP // NETWORK SCANNER")
                        .setDescription(
                            `Analyse de \`${original}\``
                        )
                        .addFields(
                            {
                                name: "🌐 Adresse",
                                value:
                                    `\`${resolvedIP}\``,
                                inline: true
                            },
                            {
                                name: "🔌 Port",
                                value:
                                    port
                                        ? `\`${port}\``
                                        : "`Non spécifié`",
                                inline: true
                            },
                            {
                                name: "🏙️ Ville",
                                value:
                                    `\`${geo.city || "Inconnue"}\``,
                                inline: true
                            },
                            {
                                name: "🗺️ Région",
                                value:
                                    `\`${geo.region || "Inconnue"}\``,
                                inline: true
                            },
                            {
                                name: "🇺🇳 Pays",
                                value:
                                    `\`${geo.country || "Inconnu"}\``,
                                inline: true
                            },
                            {
                                name: "📡 ISP",
                                value:
                                    `\`${geo.connection?.isp || "Inconnu"}\``,
                                inline: true
                            },
                            {
                                name: "🏢 Organisation",
                                value:
                                    `\`${geo.connection?.org || "Inconnue"}\``,
                                inline: false
                            },
                            {
                                name: "📍 Coordonnées",
                                value:
                                    `\`${geo.latitude}, ${geo.longitude}\``,
                                inline: true
                            }
                        )
                        .setFooter({
                            text:
                                "DAVID BOT • IP information"
                        });

                await interaction.editReply({
                    embeds: [embed]
                });

            } catch (error) {

                console.error(
                    "❌ IP error:",
                    error
                );

                await interaction.editReply({
                    content:
                        `❌ Impossible d'obtenir les informations pour \`${original}\`.`
                });
            }

            return;
        }

    } catch (error) {

        console.error(
            `❌ Erreur /${command} :`,
            error
        );

        if (interaction.replied ||
            interaction.deferred) {

            await interaction.editReply({
                content:
                    "❌ Une erreur est survenue pendant l'exécution de la commande."
            }).catch(() => {});

        } else {

            await interaction.reply({
                content:
                    "❌ Une erreur est survenue.",
                ephemeral: true
            }).catch(() => {});
        }
    }
});

// ============================================================
// ANCIEN !PING
// ============================================================

client.on("messageCreate", async message => {

    if (message.author.bot) {
        return;
    }

    if (message.content === "!ping") {

        const embed =
            new EmbedBuilder()
                .setColor(COLORS.green)
                .setTitle("🏓 PONG !")
                .setDescription(
                    `Latence : \`${client.ws.ping} ms\``
                );

        await message.reply({
            embeds: [embed]
        });
    }
});

// ============================================================
// LOGIN
// ============================================================

client.login(
    process.env.DISCORD_TOKEN
);
