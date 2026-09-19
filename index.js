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

const HEARTBEAT_DELAY = 10000;

/* =========================
   ROLES
========================= */

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};

/* =========================
   START TIME
========================= */

const BOT_START_TIME = Date.now();

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
   HEARTBEAT FUNCTION
========================= */

async function sendHeartbeatToServer() {

    try {

        console.log(
            "💓 DAVID BOT → HEARTBEAT SERVER"
        );

        const response =
            await fetch(HEARTBEAT_URL);

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data =
            await response.json();

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

/* =========================
   FORMAT UPTIME
========================= */

function formatUptime(ms) {

    let seconds =
        Math.floor(ms / 1000);

    const days =
        Math.floor(seconds / 86400);

    seconds %= 86400;

    const hours =
        Math.floor(seconds / 3600);

    seconds %= 3600;

    const minutes =
        Math.floor(seconds / 60);

    seconds %= 60;

    return (
        `${days}j ` +
        `${hours}h ` +
        `${minutes}m ` +
        `${seconds}s`
    );
}

/* =========================
   SLASH COMMANDS
========================= */

const commands = [

    /* =========================
       PING
    ========================= */

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Vérifie si DAVID BOT répond."
        ),

    /* =========================
       HELP
    ========================= */

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Affiche les commandes disponibles."
        ),

    /* =========================
       RICK ROLL
    ========================= */

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

    /* =========================
       MEME
    ========================= */

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription(
            "Envoie un meme aléatoire 😂"
        ),

    /* =========================
       WEB
    ========================= */

    new SlashCommandBuilder()
        .setName("web")
        .setDescription(
            "Envoie le site officiel de DAVID."
        ),

    /* =========================
       TIKTOK
    ========================= */

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription(
            "Envoie le TikTok de DAVID."
        ),

    /* =========================
       NEOCITIES
    ========================= */

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription(
            "Envoie le profil Neocities de DAVID."
        ),

    /* =========================
       ROLE
    ========================= */

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
        ),

    /* =========================
       BOTINFO
    ========================= */

    new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription(
            "Affiche les informations de DAVID BOT."
        ),

    /* =========================
       UPTIME
    ========================= */

    new SlashCommandBuilder()
        .setName("uptime")
        .setDescription(
            "Affiche depuis combien de temps DAVID BOT fonctionne."
        ),

    /* =========================
       INVITE
    ========================= */

    new SlashCommandBuilder()
        .setName("invite")
        .setDescription(
            "Donne le lien pour inviter DAVID BOT."
        ),

    /* =========================
       ROLES
    ========================= */

    new SlashCommandBuilder()
        .setName("roles")
        .setDescription(
            "Affiche les rôles disponibles."
        ),

    /* =========================
       USERINFO
    ========================= */

    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription(
            "Affiche les informations d'un membre."
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription(
                    "Utilisateur à regarder"
                )
                .setRequired(false)
        ),

    /* =========================
       SERVERINFO
    ========================= */

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription(
            "Affiche les informations du serveur."
        ),

    /* =========================
       COINFLIP
    ========================= */

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription(
            "Lance une pièce."
        ),

    /* =========================
       DICE
    ========================= */

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription(
            "Lance un dé."
        )
        .addIntegerOption(option =>
            option
                .setName("faces")
                .setDescription(
                    "Nombre de faces du dé"
                )
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)
        ),

    /* =========================
       SHIP
    ========================= */

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription(
            "Calcule un pourcentage d'affinité ❤️"
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription(
                    "Première personne"
                )
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("utilisateur2")
                .setDescription(
                    "Deuxième personne"
                )
                .setRequired(true)
        ),

    /* =========================
       SAY
    ========================= */

    new SlashCommandBuilder()
        .setName("say")
        .setDescription(
            "Fait parler DAVID BOT."
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte à envoyer"
                )
                .setRequired(true)
                .setMaxLength(2000)
        ),

    /* =========================
       TTS
    ========================= */

    new SlashCommandBuilder()
        .setName("tts")
        .setDescription(
            "Fait lire le texte par Discord."
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte à faire lire"
                )
                .setRequired(true)
                .setMaxLength(2000)
        ),

    /* =========================
       REPO
    ========================= */

    new SlashCommandBuilder()
        .setName("repo")
        .setDescription(
            "Affiche les informations d'un dépôt GitHub."
        )
        .addStringOption(option =>
            option
                .setName("repo")
                .setDescription(
                    "Exemple : davidtytytutu-lgtm/david-bot"
                )
                .setRequired(true)
        ),

    /* =========================
       QR
    ========================= */

    new SlashCommandBuilder()
        .setName("qr")
        .setDescription(
            "Génère un QR code."
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte ou URL à mettre dans le QR code"
                )
                .setRequired(true)
                .setMaxLength(2000)
        ),

    /* =========================
       IP
    ========================= */

    new SlashCommandBuilder()
        .setName("ip")
        .setDescription(
            "Recherche les informations publiques d'une adresse IP."
        )
        .addStringOption(option =>
            option
                .setName("ip")
                .setDescription(
                    "Adresse IP à rechercher"
                )
                .setRequired(true)
        )

];

/* =========================
   READY
========================= */

client.once(
    "ready",
    async () => {

        console.log(
            `🤖 DAVID BOT connecté en tant que ${client.user.tag}`
        );

        try {

            const guild =
                await client.guilds.fetch(
                    GUILD_ID
                );

            await guild.commands.set(
                commands
            );

            console.log(
                "✅ Commandes slash enregistrées !"
            );

        } catch (error) {

            console.error(
                "❌ Erreur commandes :",
                error
            );

        }

        setTimeout(() => {
            sendHeartbeatToServer();
        }, 5000);

    }
);

/* =========================
   INTERACTIONS
========================= */

client.on(
    "interactionCreate",
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }

        /* =========================
           PING
        ========================= */

        if (
            interaction.commandName ===
            "ping"
        ) {

            await interaction.reply(
                "🏓 Pong !"
            );

            return;
        }

        /* =========================
           HELP
        ========================= */

        if (
            interaction.commandName ===
            "help"
        ) {

            await interaction.reply({

                content:
                    "🤖 **DAVID BOT — COMMANDES**\n\n" +

                    "🛠️ **UTILITAIRE**\n" +
                    "`/ping` — Vérifier le bot\n" +
                    "`/botinfo` — Informations du bot\n" +
                    "`/uptime` — Temps en ligne\n" +
                    "`/invite` — Inviter le bot\n" +
                    "`/userinfo` — Infos utilisateur\n" +
                    "`/serverinfo` — Infos serveur\n\n" +

                    "🎭 **RÔLES**\n" +
                    "`/role` — Ajouter/retirer un rôle\n" +
                    "`/roles` — Voir les rôles disponibles\n\n" +

                    "😂 **FUN**\n" +
                    "`/meme` — Meme aléatoire\n" +
                    "`/rick-roll` — Rick Roll\n" +
                    "`/coinflip` — Pile ou face\n" +
                    "`/dice` — Lancer un dé\n" +
                    "`/ship` — Affinité entre deux personnes\n" +
                    "`/say` — Faire parler le bot\n" +
                    "`/tts` — Faire lire un texte par Discord\n\n" +

                    "💻 **CODING**\n" +
                    "`/repo` — Informations GitHub\n" +
                    "`/qr` — Générer un QR code\n\n" +

                    "🌐 **WEB**\n" +
                    "`/web` — Site officiel\n" +
                    "`/tiktok` — TikTok\n" +
                    "`/neocities` — Neocities\n" +
                    "`/ip` — Informations publiques sur une IP",

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
                        "❌ Aucun meme trouvé dans `meme/`."
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

        /* =========================
           WEB
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

            try {

                const role =
                    await interaction.guild.roles.fetch(
                        roleId
                    );

                if (!role) {

                    await interaction.reply({
                        content:
                            "❌ Rôle introuvable.",
                        ephemeral: true
                    });

                    return;
                }

                if (
                    role.position >=
                    interaction.guild.members.me.roles.highest.position
                ) {

                    await interaction.reply({
                        content:
                            "❌ Je ne peux pas gérer ce rôle car il est au-dessus de mon rôle.",
                        ephemeral: true
                    });

                    return;
                }

                const member =
                    await interaction.guild.members.fetch(
                        interaction.user.id
                    );

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

                } else {

                    await member.roles.add(
                        role
                    );

                    await interaction.reply(
                        `✅ ${role} a été ajouté à ${interaction.user}.`
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
                            "❌ Impossible de modifier ton rôle.",
                        ephemeral: true
                    });

                }

            }

            return;
        }

        /* =========================
           BOTINFO
        ========================= */

        if (
            interaction.commandName ===
            "botinfo"
        ) {

            await interaction.reply({

                content:
                    "🤖 **DAVID BOT**\n\n" +
                    "👨‍💻 Créateur : David\n" +
                    "⚙️ Technologie : Discord.js\n" +
                    "🟢 Statut : En ligne\n" +
                    "🌐 Hébergement : Render\n" +
                    "💻 Code : GitHub\n" +
                    "📦 Version : 1.0.0",

                ephemeral: false

            });

            return;
        }

        /* =========================
           UPTIME
        ========================= */

        if (
            interaction.commandName ===
            "uptime"
        ) {

            const uptime =
                Date.now() -
                BOT_START_TIME;

            await interaction.reply(
                `⏱️ **DAVID BOT est en ligne depuis :**\n\`${formatUptime(uptime)}\``
            );

            return;
        }

        /* =========================
           INVITE
        ========================= */

        if (
            interaction.commandName ===
            "invite"
        ) {

            const invite =
                `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=268435456`;

            await interaction.reply(
                `🤖 **Inviter DAVID BOT**\n${invite}`
            );

            return;
        }

        /* =========================
           ROLES
        ========================= */

        if (
            interaction.commandName ===
            "roles"
        ) {

            await interaction.reply(
                "🎭 **RÔLES DISPONIBLES**\n\n" +
                "🗿 **Wojak**\n" +
                "`/role role:Wojak`\n\n" +
                "🧌 **Troll**\n" +
                "`/role role:Troll`"
            );

            return;
        }

        /* =========================
           USERINFO
        ========================= */

        if (
            interaction.commandName ===
            "userinfo"
        ) {

            const user =
                interaction.options.getUser(
                    "utilisateur"
                ) ||
                interaction.user;

            const member =
                await interaction.guild.members.fetch(
                    user.id
                );

            await interaction.reply(
                `👤 **USERINFO**\n\n` +
                `👤 Utilisateur : ${user}\n` +
                `🏷️ Nom : \`${user.username}\`\n` +
                `🆔 ID : \`${user.id}\`\n` +
                `📅 Compte créé : <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n` +
                `📅 Arrivé sur le serveur : <t:${Math.floor(member.joinedTimestamp / 1000)}:F>\n` +
                `🎭 Rôles : ${member.roles.cache.size - 1}`
            );

            return;
        }

        /* =========================
           SERVERINFO
        ========================= */

        if (
            interaction.commandName ===
            "serverinfo"
        ) {

            const guild =
                interaction.guild;

            await interaction.reply(
                `🏠 **SERVERINFO**\n\n` +
                `📛 Nom : **${guild.name}**\n` +
                `🆔 ID : \`${guild.id}\`\n` +
                `👥 Membres : **${guild.memberCount}**\n` +
                `💬 Salons : **${guild.channels.cache.size}**\n` +
                `🎭 Rôles : **${guild.roles.cache.size}**\n` +
                `👑 Propriétaire : <@${guild.ownerId}>\n` +
                `📅 Créé : <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
            );

            return;
        }

        /* =========================
           COINFLIP
        ========================= */

        if (
            interaction.commandName ===
            "coinflip"
        ) {

            const result =
                Math.random() < 0.5
                    ? "🪙 **PILE !**"
                    : "🪙 **FACE !**";

            await interaction.reply(
                result
            );

            return;
        }

        /* =========================
           DICE
        ========================= */

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
                `🎲 Dé **D${faces}**\n\n` +
                `➡️ **${result}**`
            );

            return;
        }

        /* =========================
           SHIP
        ========================= */

        if (
            interaction.commandName ===
            "ship"
        ) {

            const user1 =
                interaction.options.getUser(
                    "utilisateur"
                );

            const user2 =
                interaction.options.getUser(
                    "utilisateur2"
                );

            const percentage =
                Math.floor(
                    Math.random() * 101
                );

            let message;

            if (percentage >= 90) {
                message = "💖 INCROYABLE !";
            } else if (percentage >= 70) {
                message = "❤️ Très bon duo !";
            } else if (percentage >= 50) {
                message = "💛 Ça peut fonctionner...";
            } else if (percentage >= 30) {
                message = "💀 C'est compliqué...";
            } else {
                message = "💔 Catastrophe.";
            }

            await interaction.reply(
                `💘 **SHIP METER**\n\n` +
                `${user1} ❤️ ${user2}\n\n` +
                `💗 **${percentage}%**\n\n` +
                message
            );

            return;
        }

        /* =========================
           SAY
        ========================= */

        if (
            interaction.commandName ===
            "say"
        ) {

            const texte =
                interaction.options.getString(
                    "texte"
                );

            await interaction.reply(
                texte
            );

            return;
        }

        /* =========================
           TTS
        ========================= */

        if (
            interaction.commandName ===
            "tts"
        ) {

            const texte =
                interaction.options.getString(
                    "texte"
                );

            await interaction.reply({
                content: texte,
                tts: true
            });

            return;
        }

        /* =========================
           GITHUB REPO
        ========================= */

        if (
            interaction.commandName ===
            "repo"
        ) {

            let repo =
                interaction.options.getString(
                    "repo"
                );

            repo = repo
                .replace(
                    /^https?:\/\/github\.com\//,
                    ""
                )
                .replace(
                    /\/$/,
                    ""
                );

            const parts =
                repo.split("/");

            if (parts.length !== 2) {

                await interaction.reply({
                    content:
                        "❌ Format incorrect.\nExemple : `/repo repo:davidtytytutu-lgtm/david-bot`",
                    ephemeral: true
                });

                return;
            }

            const response =
                await fetch(
                    `https://api.github.com/repos/${parts[0]}/${parts[1]}`,
                    {
                        headers: {
                            "User-Agent":
                                "DAVID-BOT"
                        }
                    }
                );

            if (!response.ok) {

                await interaction.reply({
                    content:
                        "❌ Dépôt GitHub introuvable.",
                    ephemeral: true
                });

                return;
            }

            const data =
                await response.json();

            await interaction.reply(
                `💻 **${data.full_name}**\n\n` +
                `📖 ${data.description || "Aucune description."}\n\n` +
                `⭐ Stars : **${data.stargazers_count}**\n` +
                `🍴 Forks : **${data.forks_count}**\n` +
                `🐛 Issues : **${data.open_issues_count}**\n\n` +
                `🔗 ${data.html_url}`
            );

            return;
        }

        /* =========================
           QR CODE
        ========================= */

        if (
            interaction.commandName ===
            "qr"
        ) {

            const texte =
                interaction.options.getString(
                    "texte"
                );

            const qrURL =
                `https://quickchart.io/qr?text=${encodeURIComponent(texte)}&size=500`;

            await interaction.reply(
                `🔳 **QR CODE**\n\n${qrURL}`
            );

            return;
        }

        /* =========================
           IP LOOKUP
        ========================= */

        if (
            interaction.commandName ===
            "ip"
        ) {

            const ip =
                interaction.options.getString(
                    "ip"
                );

            await interaction.deferReply();

            try {

                const response =
                    await fetch(
                        `https://ipapi.co/${encodeURIComponent(ip)}/json/`
                    );

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );
                }

                const data =
                    await response.json();

                if (data.error) {

                    await interaction.editReply(
                        "❌ Adresse IP invalide ou introuvable."
                    );

                    return;
                }

                await interaction.editReply(
                    `🌐 **INFORMATIONS IP**\n\n` +
                    `📡 IP : \`${data.ip || ip}\`\n` +
                    `🌍 Pays : **${data.country_name || "Inconnu"}**\n` +
                    `🏙️ Ville : **${data.city || "Inconnue"}**\n` +
                    `🗺️ Région : **${data.region || "Inconnue"}**\n` +
                    `📮 Code postal : **${data.postal || "Inconnu"}**\n` +
                    `🏢 FAI/Organisation : **${data.org || "Inconnu"}**\n` +
                    `🕐 Fuseau : **${data.timezone || "Inconnu"}**`
                );

            } catch (error) {

                console.error(
                    "❌ Erreur /ip :",
                    error
                );

                await interaction.editReply(
                    "❌ Impossible de récupérer les informations de cette IP."
                );

            }

            return;
        }

    }
);

/* =========================
   !PING
========================= */

client.on(
    "messageCreate",
    message => {

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
