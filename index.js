const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const http = require("http");


// ============================================================
// DAVID BOT - CONFIGURATION
// ============================================================

const GUILD_ID = "1550531386295718060";

const WEBSITE = "https://david-officiel.neocities.org/";
const TIKTOK = "https://www.tiktok.com/@0cherif_cat0";
const NEOCITIES = "https://neocities.org/site/david-officiel";

const GITHUB_REPO =
    "https://github.com/davidtytytutu-lgtm/david-bot";

const GITHUB_MEME_REPO =
    "https://api.github.com/repos/davidtytytutu-lgtm/david-bot/contents/meme";

const RICK_ROLL_GIF =
    "https://c.tenor.com/x8v1oNUOmg4AAAAd/tenor.gif";


// ============================================================
// HEARTBEAT
// ============================================================

const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 10000;


// ============================================================
// ROLES
// ============================================================

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};


// ============================================================
// RGB ROLE
// ============================================================

const RGB_ROLE_ID = "1550591165919657998";

// 1000 = 1 seconde
// 3000 = 3 secondes
const RGB_SPEED = 3000;

const RGB_COLORS = [
    "#FF0000",
    "#FF3300",
    "#FF6600",
    "#FF9900",
    "#FFFF00",
    "#99FF00",
    "#33FF00",
    "#00FF00",
    "#00FF66",
    "#00FFFF",
    "#00AAFF",
    "#0066FF",
    "#0000FF",
    "#3300FF",
    "#6600FF",
    "#9900FF",
    "#CC00FF",
    "#FF00FF",
    "#FF00AA",
    "#FF0066"
];

let rgbColorIndex = 0;
let rgbInterval = null;


// ============================================================
// TEMPS DE DÉMARRAGE
// ============================================================

const BOT_START_TIME = Date.now();


// ============================================================
// DISCORD CLIENT
// ============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


// ============================================================
// PETIT SERVEUR HTTP POUR RENDER
// ============================================================

const server = http.createServer((req, res) => {

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.url === "/heartbeat") {

        console.log("💓 Heartbeat reçu");

        res.writeHead(200);
        res.end(
            JSON.stringify({
                ok: true,
                service: "DAVID BOT",
                time: new Date().toISOString()
            })
        );

        return;
    }

    if (req.url === "/") {

        res.writeHead(200);

        res.end(
            JSON.stringify({
                online: true,
                bot: "DAVID BOT",
                uptime: formatUptime(),
                heartbeat: true
            })
        );

        return;
    }

    res.writeHead(404);

    res.end(
        JSON.stringify({
            error: "Not found"
        })
    );
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {

    console.log(`🌐 HTTP SERVER : PORT ${PORT}`);

});


// ============================================================
// FORMAT UPTIME
// ============================================================

function formatUptime() {

    const seconds = Math.floor(
        (Date.now() - BOT_START_TIME) / 1000
    );

    const days = Math.floor(seconds / 86400);

    const hours = Math.floor(
        (seconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${days}j ${hours}h ${minutes}m ${secs}s`;
}


// ============================================================
// HEARTBEAT
// ============================================================

async function sendHeartbeatToServer() {

    try {

        console.log(
            "💓 DAVID BOT → HEARTBEAT SERVER"
        );

        const response = await fetch(
            HEARTBEAT_URL,
            {
                method: "GET"
            }
        );

        if (!response.ok) {

            console.log(
                `⚠️ HEARTBEAT SERVER : HTTP ${response.status}`
            );

            return;
        }

        const text = await response.text();

        console.log(
            `✅ HEARTBEAT SERVER a répondu : ${text}`
        );

    } catch (error) {

        console.log(
            "❌ HEARTBEAT ERROR :",
            error.message
        );

    }
}


// ============================================================
// HEX → NOMBRE
// ============================================================

function hexToNumber(hex) {

    return parseInt(
        hex.replace("#", ""),
        16
    );
}


// ============================================================
// RGB DU RÔLE
// ============================================================

async function startRGB() {

    try {

        const guild = await client.guilds.fetch(GUILD_ID);

        if (!guild) {

            console.log(
                "❌ RGB : serveur introuvable"
            );

            return;
        }


        const role = await guild.roles.fetch(
            RGB_ROLE_ID
        );


        if (!role) {

            console.log(
                `❌ RGB : rôle ${RGB_ROLE_ID} introuvable`
            );

            return;
        }


        console.log(
            `🌈 RGB activé sur le rôle : ${role.name}`
        );


        // ----------------------------------------------------
        // BOT
        // ----------------------------------------------------

        const me = await guild.members.fetch(
            client.user.id
        );


        // ----------------------------------------------------
        // PERMISSION
        // ----------------------------------------------------

        if (
            !me.permissions.has(
                PermissionFlagsBits.ManageRoles
            )
        ) {

            console.log(
                "❌ RGB : le bot n'a pas la permission Gérer les rôles"
            );

            return;
        }


        // ----------------------------------------------------
        // RÔLE GÉRABLE ?
        // ----------------------------------------------------

        if (!role.editable) {

            console.log(
                "❌ RGB : le bot ne peut pas modifier ce rôle."
            );

            console.log(
                `🤖 Rôle du bot : ${me.roles.highest.name}`
            );

            console.log(
                `🎨 Rôle RGB : ${role.name}`
            );

            console.log(
                `📊 Position bot : ${me.roles.highest.position}`
            );

            console.log(
                `📊 Position RGB : ${role.position}`
            );

            console.log(
                "➡️ Place le rôle du bot AU-DESSUS du rôle RGB."
            );

            return;
        }


        // ----------------------------------------------------
        // COULEUR INITIALE
        // ----------------------------------------------------

        const firstColor =
            RGB_COLORS[rgbColorIndex];

        await role.setColors({
            primaryColor: firstColor
        });

        console.log(
            `🎨 RGB couleur initiale : ${firstColor}`
        );


        // ----------------------------------------------------
        // ÉVITE PLUSIEURS INTERVALS
        // ----------------------------------------------------

        if (rgbInterval) {

            clearInterval(rgbInterval);

        }


        rgbInterval = setInterval(
            async () => {

                try {

                    rgbColorIndex++;

                    if (
                        rgbColorIndex >=
                        RGB_COLORS.length
                    ) {

                        rgbColorIndex = 0;

                    }


                    const newColor =
                        RGB_COLORS[rgbColorIndex];


                    await role.setColors({
                        primaryColor: newColor
                    });


                    console.log(
                        `🌈 RGB → ${newColor}`
                    );


                } catch (error) {

                    console.log(
                        `❌ RGB : ${error.message}`
                    );

                }

            },
            RGB_SPEED
        );


    } catch (error) {

        console.log(
            `❌ RGB ERROR : ${error.message}`
        );

    }
}


// ============================================================
// COMMANDES SLASH
// ============================================================

const commands = [

    // --------------------------------------------------------
    // /ping
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Affiche le ping du bot"),


    // --------------------------------------------------------
    // /help
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche toutes les commandes"),


    // --------------------------------------------------------
    // /rick-roll
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription("😈 Tu t'es fait rickroll"),


    // --------------------------------------------------------
    // /meme
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Affiche un meme aléatoire"),


    // --------------------------------------------------------
    // /web
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("web")
        .setDescription("Affiche le site DAVID OFFICIEL"),


    // --------------------------------------------------------
    // /tiktok
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription("Affiche le TikTok"),


    // --------------------------------------------------------
    // /neocities
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription("Affiche la page Neocities"),


    // --------------------------------------------------------
    // /role
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("role")
        .setDescription("Ajoute ou retire un rôle")
        .addStringOption(option =>
            option
                .setName("role")
                .setDescription("Rôle à modifier")
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
    // /botinfo
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Informations sur DAVID BOT"),


    // --------------------------------------------------------
    // /uptime
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Affiche le temps de fonctionnement"),


    // --------------------------------------------------------
    // /invite
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Lien d'invitation du bot"),


    // --------------------------------------------------------
    // /roles
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("roles")
        .setDescription("Affiche les rôles du serveur"),


    // --------------------------------------------------------
    // /userinfo
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Informations sur un utilisateur")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Utilisateur")
                .setRequired(false)
        ),


    // --------------------------------------------------------
    // /serverinfo
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Informations sur le serveur"),


    // --------------------------------------------------------
    // /coinflip
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Lance une pièce"),


    // --------------------------------------------------------
    // /dice
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Lance un dé")
        .addIntegerOption(option =>
            option
                .setName("faces")
                .setDescription("Nombre de faces")
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)
        ),


    // --------------------------------------------------------
    // /ship
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Calcule un pourcentage d'amour")
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


    // --------------------------------------------------------
    // /say
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("say")
        .setDescription("Fait parler le bot")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message")
                .setRequired(true)
        ),


    // --------------------------------------------------------
    // /tts
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("tts")
        .setDescription("Fait parler le bot en TTS")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Message à prononcer")
                .setRequired(true)
        ),


    // --------------------------------------------------------
    // /repo
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("repo")
        .setDescription("Affiche le GitHub de DAVID BOT"),


    // --------------------------------------------------------
    // /qr
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("qr")
        .setDescription("Crée un QR code")
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription("Texte ou URL")
                .setRequired(true)
        ),


    // --------------------------------------------------------
    // /ip
    // --------------------------------------------------------

    new SlashCommandBuilder()
        .setName("ip")
        .setDescription("Analyse une IP ou un domaine")
        .addStringOption(option =>
            option
                .setName("adresse")
                .setDescription(
                    "IP, IP:port, domaine ou domaine:port"
                )
                .setRequired(true)
        )

].map(command => command.toJSON());


// ============================================================
// READY
// ============================================================

client.once("clientReady", async () => {

    console.log("");
    console.log("========================================");
    console.log("       DAVID BOT EST EN LIGNE");
    console.log("========================================");
    console.log(
        `🤖 Connecté en tant que ${client.user.tag}`
    );
    console.log(
        `🆔 ID : ${client.user.id}`
    );
    console.log("========================================");
    console.log("");


    // --------------------------------------------------------
    // COMMANDES GLOBALES
    // --------------------------------------------------------

    try {

        await client.application.commands.set(
            commands
        );

        console.log(
            "✅ Commandes slash globales enregistrées"
        );

    } catch (error) {

        console.log(
            "❌ Erreur commandes :",
            error.message
        );

    }


    // --------------------------------------------------------
    // RGB
    // --------------------------------------------------------

    await startRGB();


    // --------------------------------------------------------
    // HEARTBEAT
    // --------------------------------------------------------

    setTimeout(
        sendHeartbeatToServer,
        5000
    );

    setInterval(
        sendHeartbeatToServer,
        HEARTBEAT_DELAY
    );

});


// ============================================================
// INTERACTIONS
// ============================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (!interaction.isChatInputCommand()) {

            return;
        }


        try {

            // ==================================================
            // /ping
            // ==================================================

            if (
                interaction.commandName ===
                "ping"
            ) {

                const ping =
                    client.ws.ping;

                await interaction.reply(
                    `🏓 Pong ! **${ping}ms**`
                );

                return;
            }


            // ==================================================
            // /help
            // ==================================================

            if (
                interaction.commandName ===
                "help"
            ) {

                await interaction.reply(
                    [
                        "🤖 **DAVID BOT — COMMANDES**",
                        "",
                        "🏓 `/ping` — Ping",
                        "📖 `/help` — Aide",
                        "😈 `/rick-roll` — Rickroll",
                        "😂 `/meme` — Meme aléatoire",
                        "🌐 `/web` — Site web",
                        "🎵 `/tiktok` — TikTok",
                        "🌃 `/neocities` — Neocities",
                        "🎭 `/role` — Ajouter/retirer un rôle",
                        "🤖 `/botinfo` — Infos bot",
                        "⏱️ `/uptime` — Uptime",
                        "🔗 `/invite` — Invitation",
                        "🎭 `/roles` — Rôles",
                        "👤 `/userinfo` — Utilisateur",
                        "🏠 `/serverinfo` — Serveur",
                        "🪙 `/coinflip` — Pile ou face",
                        "🎲 `/dice` — Dé",
                        "❤️ `/ship` — Compatibilité",
                        "💬 `/say` — Faire parler le bot",
                        "🔊 `/tts` — TTS",
                        "💻 `/repo` — GitHub",
                        "🔳 `/qr` — QR code",
                        "🌍 `/ip` — Analyse IP/domaine"
                    ].join("\n")
                );

                return;
            }


            // ==================================================
            // /rick-roll
            // ==================================================

            if (
                interaction.commandName ===
                "rick-roll"
            ) {

                await interaction.reply(
                    {
                        content:
                            "🎵 Never gonna give you up...",
                        embeds: [
                            {
                                image: {
                                    url: RICK_ROLL_GIF
                                }
                            }
                        ]
                    }
                );

                return;
            }


            // ==================================================
            // /meme
            // ==================================================

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


                    const images =
                        files.filter(
                            file =>
                                file.type === "file" &&
                                /\.(png|jpg|jpeg|gif|webp)$/i.test(
                                    file.name
                                )
                        );


                    if (
                        images.length === 0
                    ) {

                        await interaction.editReply(
                            "❌ Aucun meme trouvé dans le dossier `meme`."
                        );

                        return;
                    }


                    const random =
                        images[
                            Math.floor(
                                Math.random() *
                                images.length
                            )
                        ];


                    await interaction.editReply(
                        {
                            content:
                                `😂 **${random.name}**`,
                            files: [
                                random.download_url
                            ]
                        }
                    );


                } catch (error) {

                    console.log(
                        "❌ MEME :",
                        error.message
                    );

                    await interaction.editReply(
                        "❌ Impossible de récupérer un meme."
                    );

                }

                return;
            }


            // ==================================================
            // /web
            // ==================================================

            if (
                interaction.commandName ===
                "web"
            ) {

                await interaction.reply(
                    `🌐 **DAVID OFFICIEL**\n${WEBSITE}`
                );

                return;
            }


            // ==================================================
            // /tiktok
            // ==================================================

            if (
                interaction.commandName ===
                "tiktok"
            ) {

                await interaction.reply(
                    `🎵 **TikTok DAVID**\n${TIKTOK}`
                );

                return;
            }


            // ==================================================
            // /neocities
            // ==================================================

            if (
                interaction.commandName ===
                "neocities"
            ) {

                await interaction.reply(
                    `🌃 **Neocities DAVID OFFICIEL**\n${NEOCITIES}`
                );

                return;
            }


            // ==================================================
            // /role
            // ==================================================

            if (
                interaction.commandName ===
                "role"
            ) {

                const selected =
                    interaction.options.getString(
                        "role"
                    );


                const roleId =
                    ROLES[selected];


                if (!roleId) {

                    await interaction.reply(
                        "❌ Rôle invalide."
                    );

                    return;
                }


                const role =
                    interaction.guild.roles.cache.get(
                        roleId
                    );


                if (!role) {

                    await interaction.reply(
                        "❌ Rôle introuvable."
                    );

                    return;
                }


                const member =
                    await interaction.guild.members.fetch(
                        interaction.user.id
                    );


                if (
                    member.roles.cache.has(
                        role.id
                    )
                ) {

                    await member.roles.remove(
                        role
                    );

                    await interaction.reply(
                        `❌ Rôle **${role.name}** retiré.`
                    );

                } else {

                    await member.roles.add(
                        role
                    );

                    await interaction.reply(
                        `✅ Rôle **${role.name}** ajouté.`
                    );

                }

                return;
            }


            // ==================================================
            // /botinfo
            // ==================================================

            if (
                interaction.commandName ===
                "botinfo"
            ) {

                await interaction.reply(
                    [
                        "🤖 **DAVID BOT**",
                        "",
                        `👤 Bot : **${client.user.tag}**`,
                        `🆔 ID : **${client.user.id}**`,
                        `📡 Ping : **${client.ws.ping}ms**`,
                        `⏱️ Uptime : **${formatUptime()}**`,
                        "🟢 Status : **ONLINE**",
                        "💻 Node.js : **24.x**",
                        "📦 discord.js : **14.x**"
                    ].join("\n")
                );

                return;
            }


            // ==================================================
            // /uptime
            // ==================================================

            if (
                interaction.commandName ===
                "uptime"
            ) {

                await interaction.reply(
                    `⏱️ DAVID BOT fonctionne depuis **${formatUptime()}**`
                );

                return;
            }


            // ==================================================
            // /invite
            // ==================================================

            if (
                interaction.commandName ===
                "invite"
            ) {

                const invite =
                    `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=268435456&scope=bot%20applications.commands`;

                await interaction.reply(
                    `🤖 **Inviter DAVID BOT**\n${invite}`
                );

                return;
            }


            // ==================================================
            // /roles
            // ==================================================

            if (
                interaction.commandName ===
                "roles"
            ) {

                const roles =
                    interaction.guild.roles.cache
                        .filter(
                            role =>
                                role.id !==
                                interaction.guild.id
                        )
                        .sort(
                            (a, b) =>
                                b.position -
                                a.position
                        )
                        .map(
                            role =>
                                `• ${role} — \`${role.id}\``
                        );


                const text =
                    roles.join("\n");


                await interaction.reply(
                    {
                        content:
                            `🎭 **Rôles du serveur**\n\n${text || "Aucun rôle."}`,
                        allowedMentions: {
                            parse: []
                        }
                    }
                );

                return;
            }


            // ==================================================
            // /userinfo
            // ==================================================

            if (
                interaction.commandName ===
                "userinfo"
            ) {

                const user =
                    interaction.options.getUser(
                        "user"
                    ) ||
                    interaction.user;


                const member =
                    await interaction.guild.members
                        .fetch(user.id)
                        .catch(() => null);


                await interaction.reply(
                    [
                        "👤 **USER INFO**",
                        "",
                        `Nom : **${user.tag}**`,
                        `ID : \`${user.id}\``,
                        `Bot : **${user.bot ? "Oui" : "Non"}**`,
                        member
                            ? `Compte créé : <t:${Math.floor(user.createdTimestamp / 1000)}:F>`
                            : ""
                    ]
                        .filter(Boolean)
                        .join("\n")
                );

                return;
            }


            // ==================================================
            // /serverinfo
            // ==================================================

            if (
                interaction.commandName ===
                "serverinfo"
            ) {

                const guild =
                    interaction.guild;


                await interaction.reply(
                    [
                        "🏠 **SERVER INFO**",
                        "",
                        `Nom : **${guild.name}**`,
                        `ID : \`${guild.id}\``,
                        `Membres : **${guild.memberCount}**`,
                        `Rôles : **${guild.roles.cache.size}**`,
                        `Salons : **${guild.channels.cache.size}**`,
                        `Créé le : <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
                    ].join("\n")
                );

                return;
            }


            // ==================================================
            // /coinflip
            // ==================================================

            if (
                interaction.commandName ===
                "coinflip"
            ) {

                const result =
                    Math.random() < 0.5
                        ? "PILE 🪙"
                        : "FACE 🪙";


                await interaction.reply(
                    `🪙 La pièce tombe sur **${result}** !`
                );

                return;
            }


            // ==================================================
            // /dice
            // ==================================================

            if (
                interaction.commandName ===
                "dice"
            ) {

                const faces =
                    interaction.options.getInteger(
                        "faces"
                    ) || 6;


                const result =
                    Math.floor(
                        Math.random() * faces
                    ) + 1;


                await interaction.reply(
                    `🎲 Dé **D${faces}** → **${result}**`
                );

                return;
            }


            // ==================================================
            // /ship
            // ==================================================

            if (
                interaction.commandName ===
                "ship"
            ) {

                const user1 =
                    interaction.options.getUser(
                        "user1"
                    );

                const user2 =
                    interaction.options.getUser(
                        "user2"
                    );


                const combined =
                    [
                        user1.id,
                        user2.id
                    ]
                        .sort()
                        .join("");


                let hash = 0;

                for (
                    const char of combined
                ) {

                    hash =
                        (
                            hash * 31 +
                            char.charCodeAt(0)
                        ) >>> 0;

                }


                const percentage =
                    hash % 101;


                let emoji = "💔";


                if (
                    percentage >= 80
                ) {

                    emoji = "💖";

                } else if (
                    percentage >= 50
                ) {

                    emoji = "❤️";

                } else if (
                    percentage >= 30
                ) {

                    emoji = "💛";

                }


                await interaction.reply(
                    `${user1} ❤️ ${user2}\n\n${emoji} **${percentage}%**`
                );

                return;
            }


            // ==================================================
            // /say
            // ==================================================

            if (
                interaction.commandName ===
                "say"
            ) {

                const message =
                    interaction.options.getString(
                        "message"
                    );


                await interaction.reply(
                    {
                        content:
                            message,
                        allowedMentions: {
                            parse: []
                        }
                    }
                );

                return;
            }


            // ==================================================
            // /tts
            // ==================================================

            if (
                interaction.commandName ===
                "tts"
            ) {

                const message =
                    interaction.options.getString(
                        "message"
                    );


                await interaction.reply(
                    {
                        content:
                            message,
                        tts: true,
                        allowedMentions: {
                            parse: []
                        }
                    }
                );

                return;
            }


            // ==================================================
            // /repo
            // ==================================================

            if (
                interaction.commandName ===
                "repo"
            ) {

                await interaction.reply(
                    `💻 **GitHub DAVID BOT**\n${GITHUB_REPO}`
                );

                return;
            }


            // ==================================================
            // /qr
            // ==================================================

            if (
                interaction.commandName ===
                "qr"
            ) {

                const text =
                    interaction.options.getString(
                        "texte"
                    );


                const qrUrl =
                    `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;


                await interaction.reply(
                    {
                        content:
                            `🔳 QR code pour : \`${text}\``,
                        files: [
                            {
                                attachment:
                                    qrUrl,
                                name:
                                    "david-qr.png"
                            }
                        ]
                    }
                );

                return;
            }


            // ==================================================
            // /ip
            // ==================================================

            if (
                interaction.commandName ===
                "ip"
            ) {

                await interaction.deferReply();


                const input =
                    interaction.options.getString(
                        "adresse"
                    ).trim();


                // ------------------------------------------------
                // Extraction port
                // ------------------------------------------------

                let host = input;
                let port = null;


                const portMatch =
                    host.match(
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

                        await interaction.editReply(
                            "❌ Port invalide. Il doit être compris entre **1 et 65535**."
                        );

                        return;
                    }
                }


                // ------------------------------------------------
                // Nettoyage
                // ------------------------------------------------

                host =
                    host
                        .replace(
                            /^https?:\/\//i,
                            ""
                        )
                        .replace(
                            /\/.*$/,
                            ""
                        );


                // ------------------------------------------------
                // Regex IPv4
                // ------------------------------------------------

                const ipv4 =
                    /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;


                const privateIP =
                    /^(10\.)|(127\.)|(192\.168\.)|(169\.254\.)|(172\.(1[6-9]|2\d|3[0-1])\.)$/;


                // ------------------------------------------------
                // IP PRIVÉE
                // ------------------------------------------------

                if (
                    ipv4.test(
                        host
                    )
                ) {

                    if (
                        privateIP.test(
                            host
                        )
                    ) {

                        await interaction.editReply(
                            [
                                "🔒 **IP privée détectée**",
                                "",
                                `📡 Adresse : **${host}**`,
                                port
                                    ? `🔌 Port : **${port}**`
                                    : "",
                                "",
                                "Cette adresse appartient à un réseau privé/local.",
                                "Une géolocalisation publique fiable n'est pas possible."
                            ]
                                .filter(Boolean)
                                .join("\n")
                        );

                        return;
                    }


                    // ------------------------------------------------
                    // IP PUBLIQUE
                    // ------------------------------------------------

                    const response =
                        await fetch(
                            `https://ipwho.is/${encodeURIComponent(host)}`
                        );


                    const data =
                        await response.json();


                    if (
                        !data.success
                    ) {

                        await interaction.editReply(
                            `❌ Impossible d'analyser **${host}**.`
                        );

                        return;
                    }


                    await interaction.editReply(
                        [
                            "🌍 **ANALYSE IP**",
                            "",
                            `📡 IP : **${host}**`,
                            port
                                ? `🔌 Port : **${port}**`
                                : "",
                            "",
                            `🌎 Pays : **${data.country || "Inconnu"}**`,
                            `🏙️ Ville : **${data.city || "Inconnue"}**`,
                            `🗺️ Région : **${data.region || "Inconnue"}**`,
                            `📮 Code postal : **${data.postal || "Inconnu"}**`,
                            `🏢 Organisation : **${data.connection?.org || "Inconnue"}**`,
                            `📡 ISP : **${data.connection?.isp || "Inconnu"}**`,
                            `🕐 Fuseau : **${data.timezone?.id || "Inconnu"}**`
                        ]
                            .filter(Boolean)
                            .join("\n")
                    );

                    return;
                }


                // ------------------------------------------------
                // DOMAINE
                // ------------------------------------------------

                const domain =
                    /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


                if (
                    !domain.test(
                        host
                    )
                ) {

                    await interaction.editReply(
                        [
                            "❌ Adresse invalide.",
                            "",
                            "Exemples acceptés :",
                            "`8.8.8.8`",
                            "`8.8.8.8:27015`",
                            "`192.168.1.65:27015`",
                            "`example.com`",
                            "`example.com:27015`"
                        ].join("\n")
                    );

                    return;
                }


                // ------------------------------------------------
                // DNS GOOGLE
                // ------------------------------------------------

                const dnsResponse =
                    await fetch(
                        `https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`
                    );


                const dnsData =
                    await dnsResponse.json();


                const answer =
                    dnsData.Answer?.find(
                        record =>
                            record.type === 1
                    );


                if (!answer) {

                    await interaction.editReply(
                        `❌ Impossible de résoudre le domaine **${host}**.`
                    );

                    return;
                }


                const resolvedIP =
                    answer.data;


                // ------------------------------------------------
                // GÉOLOCALISATION
                // ------------------------------------------------

                const geoResponse =
                    await fetch(
                        `https://ipwho.is/${encodeURIComponent(resolvedIP)}`
                    );


                const geo =
                    await geoResponse.json();


                if (
                    !geo.success
                ) {

                    await interaction.editReply(
                        [
                            "🌐 **DOMAINE RÉSOLU**",
                            "",
                            `🔗 Domaine : **${host}**`,
                            `📡 IP : **${resolvedIP}**`,
                            port
                                ? `🔌 Port : **${port}**`
                                : ""
                        ]
                            .filter(Boolean)
                            .join("\n")
                    );

                    return;
                }


                await interaction.editReply(
                    [
                        "🌐 **ANALYSE DOMAINE**",
                        "",
                        `🔗 Domaine : **${host}**`,
                        `📡 IP : **${resolvedIP}**`,
                        port
                            ? `🔌 Port : **${port}**`
                            : "",
                        "",
                        `🌎 Pays : **${geo.country || "Inconnu"}**`,
                        `🏙️ Ville : **${geo.city || "Inconnue"}**`,
                        `🗺️ Région : **${geo.region || "Inconnue"}**`,
                        `📮 Code postal : **${geo.postal || "Inconnu"}**`,
                        `🏢 Organisation : **${geo.connection?.org || "Inconnue"}**`,
                        `📡 ISP : **${geo.connection?.isp || "Inconnu"}**`,
                        `🕐 Fuseau : **${geo.timezone?.id || "Inconnu"}**`
                    ]
                        .filter(Boolean)
                        .join("\n")
                );

                return;
            }


        } catch (error) {

            console.error(
                "❌ INTERACTION ERROR :",
                error
            );


            if (
                interaction.deferred ||
                interaction.replied
            ) {

                await interaction.editReply(
                    "❌ Une erreur est survenue."
                ).catch(() => {});

            } else {

                await interaction.reply(
                    "❌ Une erreur est survenue."
                ).catch(() => {});

            }

        }

    }
);


// ============================================================
// !ping
// ============================================================

client.on(
    "messageCreate",
    async message => {

        if (
            message.author.bot
        ) {

            return;
        }


        if (
            message.content.toLowerCase() ===
            "!ping"
        ) {

            await message.reply(
                `🏓 Pong ! **${client.ws.ping}ms**`
            );

        }

    }
);


// ============================================================
// ERREURS
// ============================================================

client.on(
    "error",
    error => {

        console.error(
            "❌ Discord Client Error :",
            error
        );

    }
);


process.on(
    "unhandledRejection",
    error => {

        console.error(
            "❌ Unhandled Rejection :",
            error
        );

    }
);


process.on(
    "uncaughtException",
    error => {

        console.error(
            "❌ Uncaught Exception :",
            error
        );

    }
);


// ============================================================
// LOGIN
// ============================================================

if (
    !process.env.DISCORD_TOKEN
) {

    console.error(
        "❌ DISCORD_TOKEN est absent des variables d'environnement."
    );

    process.exit(1);
}


client.login(
    process.env.DISCORD_TOKEN
);
