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

const HEARTBEAT_URL =
    "https://david-bot-heartbeat.onrender.com/heartbeat";

const HEARTBEAT_DELAY = 10000;

const ROLES = {
    wojak: "1550800068767121438",
    troll: "1550796528942317648"
};


/* =========================================================
   RGB DU NOM
========================================================= */

const RGB_NAMES = [
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭",
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭",
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭",
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭",
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭",
    "𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭"
];

let rgbIndex = 0;


/* =========================================================
   TEMPS DE DÉMARRAGE
========================================================= */

const BOT_START_TIME = Date.now();


/* =========================================================
   CLIENT DISCORD
========================================================= */

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});


/* =========================================================
   SERVEUR HTTP POUR RENDER
========================================================= */

const PORT =
    process.env.PORT || 10000;

const server =
    http.createServer((req, res) => {

        if (req.url === "/heartbeat") {

            console.log(
                "💓 Heartbeat reçu"
            );

            res.writeHead(
                200,
                {
                    "Content-Type":
                        "application/json"
                }
            );

            res.end(
                JSON.stringify({
                    status: "ok",
                    heartbeat: true,
                    from: "DAVID-BOT"
                })
            );

            setTimeout(
                () => {
                    sendHeartbeatToServer();
                },
                HEARTBEAT_DELAY
            );

            return;
        }


        if (req.url === "/") {

            res.writeHead(
                200,
                {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                }
            );

            res.end(
                "🤖 DAVID BOT est en ligne !"
            );

            return;
        }


        res.writeHead(
            404,
            {
                "Content-Type":
                    "text/plain; charset=utf-8"
            }
        );

        res.end(
            "404 - Not Found"
        );
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


/* =========================================================
   HEARTBEAT
========================================================= */

async function sendHeartbeatToServer() {

    try {

        console.log(
            "💓 DAVID BOT → HEARTBEAT SERVER"
        );

        const response =
            await fetch(
                HEARTBEAT_URL
            );

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

        setTimeout(
            () => {
                sendHeartbeatToServer();
            },
            30000
        );

    }

}


/* =========================================================
   UPTIME
========================================================= */

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

    return `${days}j ${hours}h ${minutes}m ${seconds}s`;
}


/* =========================================================
   COMMANDES SLASH
========================================================= */

const commands = [

    new SlashCommandBuilder()
        .setName("ping")
        .setDescription(
            "Vérifie si DAVID BOT répond"
        ),

    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Affiche la liste des commandes"
        ),

    new SlashCommandBuilder()
        .setName("rick-roll")
        .setDescription(
            "😈 Tu t'es fait Rick Roll"
        ),

    new SlashCommandBuilder()
        .setName("meme")
        .setDescription(
            "Envoie un meme aléatoire"
        ),

    new SlashCommandBuilder()
        .setName("web")
        .setDescription(
            "Affiche le site de David"
        ),

    new SlashCommandBuilder()
        .setName("tiktok")
        .setDescription(
            "Affiche le TikTok de David"
        ),

    new SlashCommandBuilder()
        .setName("neocities")
        .setDescription(
            "Affiche la page Neocities"
        ),

    new SlashCommandBuilder()
        .setName("role")
        .setDescription(
            "Active ou désactive un rôle"
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
        .setDescription(
            "Informations sur DAVID BOT"
        ),

    new SlashCommandBuilder()
        .setName("uptime")
        .setDescription(
            "Affiche depuis combien de temps le bot est en ligne"
        ),

    new SlashCommandBuilder()
        .setName("invite")
        .setDescription(
            "Obtenir le lien d'invitation du bot"
        ),

    new SlashCommandBuilder()
        .setName("roles")
        .setDescription(
            "Liste les rôles disponibles"
        ),

    new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription(
            "Informations sur un utilisateur"
        )
        .addUserOption(option =>
            option
                .setName("utilisateur")
                .setDescription(
                    "Utilisateur à regarder"
                )
                .setRequired(false)
        ),

    new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription(
            "Informations sur le serveur"
        ),

    new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription(
            "Lance une pièce"
        ),

    new SlashCommandBuilder()
        .setName("dice")
        .setDescription(
            "Lance un dé"
        )
        .addIntegerOption(option =>
            option
                .setName("faces")
                .setDescription(
                    "Nombre de faces"
                )
                .setRequired(false)
                .setMinValue(2)
                .setMaxValue(100)
        ),

    new SlashCommandBuilder()
        .setName("ship")
        .setDescription(
            "Calcule le pourcentage de compatibilité"
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

    new SlashCommandBuilder()
        .setName("say")
        .setDescription(
            "Fait parler le bot"
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte à envoyer"
                )
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("tts")
        .setDescription(
            "Envoie un message TTS"
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte à lire"
                )
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("repo")
        .setDescription(
            "Informations sur un dépôt GitHub"
        )
        .addStringOption(option =>
            option
                .setName("repo")
                .setDescription(
                    "Exemple : davidtytytutu-lgtm/david-bot"
                )
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("qr")
        .setDescription(
            "Génère un QR code"
        )
        .addStringOption(option =>
            option
                .setName("texte")
                .setDescription(
                    "Texte ou URL à encoder"
                )
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("ip")
        .setDescription(
            "Informations sur une IP ou un serveur"
        )
        .addStringOption(option =>
            option
                .setName("ip")
                .setDescription(
                    "IP, IP:PORT ou domaine:PORT"
                )
                .setRequired(true)
        )

].map(
    command =>
        command.toJSON()
);


/* =========================================================
   READY
========================================================= */

client.once(
    "ready",
    async () => {

        console.log(
            `🤖 DAVID BOT connecté en tant que ${client.user.tag}`
        );


        /* =====================================================
           COMMANDES GLOBALES
        ===================================================== */

        try {

            await client.application.commands.set(
                commands
            );

            console.log(
                "✅ Commandes globales enregistrées !"
            );

        } catch (error) {

            console.error(
                "❌ Erreur commandes :",
                error
            );

        }


        /* =====================================================
           RGB
        ===================================================== */

        try {

            const guild =
                await client.guilds.fetch(
                    GUILD_ID
                );

            const botMember =
                await guild.members.fetch(
                    client.user.id
                );

            console.log(
                "🌈 Système RGB activé !"
            );


            /*
             * Changement immédiat
             */

            await botMember.setNickname(
                RGB_NAMES[rgbIndex]
            );


            /*
             * Puis toutes les 10 secondes
             */

            setInterval(
                async () => {

                    try {

                        rgbIndex =
                            (
                                rgbIndex + 1
                            ) %
                            RGB_NAMES.length;

                        await botMember.setNickname(
                            RGB_NAMES[rgbIndex]
                        );

                        console.log(
                            `🌈 Nom RGB : ${RGB_NAMES[rgbIndex]}`
                        );

                    } catch (error) {

                        console.error(
                            "❌ Impossible de modifier le surnom :",
                            error.message
                        );

                    }

                },
                500
            );

        } catch (error) {

            console.error(
                "❌ RGB :",
                error.message
            );

        }


        /* =====================================================
           HEARTBEAT
        ===================================================== */

        setTimeout(
            () => {
                sendHeartbeatToServer();
            },
            5000
        );

    }
);


/* =========================================================
   INTERACTIONS
========================================================= */

client.on(
    "interactionCreate",
    async interaction => {

        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }


        /* =====================================================
           /ping
        ===================================================== */

        if (
            interaction.commandName ===
            "ping"
        ) {

            await interaction.reply(
                `🏓 Pong !\n📡 Latence : ${client.ws.ping}ms`
            );

            return;
        }


        /* =====================================================
           /help
        ===================================================== */

        if (
            interaction.commandName ===
            "help"
        ) {

            await interaction.reply(
                `🤖 **DAVID BOT — COMMANDES**\n\n` +

                `🏓 **/ping** — Vérifie le bot\n` +
                `❓ **/help** — Affiche cette aide\n` +
                `😈 **/rick-roll** — Rick Roll\n` +
                `😂 **/meme** — Meme aléatoire\n` +
                `🌐 **/web** — Site de David\n` +
                `🎵 **/tiktok** — TikTok\n` +
                `🏠 **/neocities** — Neocities\n` +
                `🎭 **/role** — Gestion des rôles\n\n` +

                `🤖 **/botinfo** — Infos du bot\n` +
                `⏱️ **/uptime** — Temps en ligne\n` +
                `🔗 **/invite** — Invitation\n` +
                `🎭 **/roles** — Liste des rôles\n` +
                `👤 **/userinfo** — Infos utilisateur\n` +
                `🏠 **/serverinfo** — Infos serveur\n` +
                `🪙 **/coinflip** — Pile ou face\n` +
                `🎲 **/dice** — Lance un dé\n` +
                `❤️ **/ship** — Compatibilité\n` +
                `💬 **/say** — Faire parler le bot\n` +
                `🔊 **/tts** — Message TTS\n` +
                `📦 **/repo** — Infos GitHub\n` +
                `🔳 **/qr** — QR code\n` +
                `🌍 **/ip** — Infos IP / serveur`
            );

            return;
        }


        /* =====================================================
           /rick-roll
        ===================================================== */

        if (
            interaction.commandName ===
            "rick-roll"
        ) {

            await interaction.reply(
                RICK_ROLL_GIF
            );

            return;
        }


        /* =====================================================
           /meme
        ===================================================== */

        if (
            interaction.commandName ===
            "meme"
        ) {

            await interaction.deferReply();

            try {

                const response =
                    await fetch(
                        GITHUB_MEME_REPO
                    );

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }

                const files =
                    await response.json();

                const memes =
                    files.filter(
                        file =>
                            file.type === "file" &&
                            /\.(jpg|jpeg|png|gif|webp)$/i
                                .test(file.name)
                    );

                if (
                    memes.length === 0
                ) {

                    await interaction.editReply(
                        "❌ Aucun meme trouvé."
                    );

                    return;
                }

                const random =
                    memes[
                        Math.floor(
                            Math.random() *
                            memes.length
                        )
                    ];

                await interaction.editReply(
                    `😂 **MEME RANDOM**\n${random.download_url}`
                );

            } catch (error) {

                console.error(
                    "❌ Meme :",
                    error
                );

                await interaction.editReply(
                    "❌ Impossible de récupérer un meme."
                );

            }

            return;
        }


        /* =====================================================
           /web
        ===================================================== */

        if (
            interaction.commandName ===
            "web"
        ) {

            await interaction.reply(
                `🌐 **SITE DE DAVID**\n${WEBSITE}`
            );

            return;
        }


        /* =====================================================
           /tiktok
        ===================================================== */

        if (
            interaction.commandName ===
            "tiktok"
        ) {

            await interaction.reply(
                `🎵 **TIKTOK**\n${TIKTOK}`
            );

            return;
        }


        /* =====================================================
           /neocities
        ===================================================== */

        if (
            interaction.commandName ===
            "neocities"
        ) {

            await interaction.reply(
                `🏠 **NEOCITIES**\n${NEOCITIES}`
            );

            return;
        }


        /* =====================================================
           /role
        ===================================================== */

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

            const role =
                interaction.guild.roles.cache.get(
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

            try {

                if (
                    interaction.member.roles.cache.has(
                        roleId
                    )
                ) {

                    await interaction.member.roles.remove(
                        role
                    );

                    await interaction.reply(
                        `❌ Rôle **${role.name}** retiré.`
                    );

                } else {

                    await interaction.member.roles.add(
                        role
                    );

                    await interaction.reply(
                        `✅ Rôle **${role.name}** ajouté !`
                    );

                }

            } catch (error) {

                console.error(
                    "❌ Role :",
                    error
                );

                await interaction.reply({
                    content:
                        "❌ Impossible de modifier ton rôle. Vérifie que DAVID BOT possède la permission **Gérer les rôles** et que son rôle est placé au-dessus du rôle concerné.",
                    ephemeral: true
                });

            }

            return;
        }


        /* =====================================================
           /botinfo
        ===================================================== */

        if (
            interaction.commandName ===
            "botinfo"
        ) {

            await interaction.reply(
                `🤖 **DAVID BOT**\n\n` +
                `👤 Créateur : **David**\n` +
                `📦 Version : **1.0.0**\n` +
                `☁️ Hébergement : **Render**\n` +
                `💻 Code : **GitHub**`
            );

            return;
        }


        /* =====================================================
           /uptime
        ===================================================== */

        if (
            interaction.commandName ===
            "uptime"
        ) {

            await interaction.reply(
                `⏱️ **DAVID BOT est en ligne depuis :**\n\n` +
                `\`${formatUptime(
                    Date.now() -
                    BOT_START_TIME
                )}\``
            );

            return;
        }


        /* =====================================================
           /invite
        ===================================================== */

        if (
            interaction.commandName ===
            "invite"
        ) {

            const invite =
                `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot%20applications.commands&permissions=268435456`;

            await interaction.reply(
                `🔗 **INVITER DAVID BOT**\n${invite}`
            );

            return;
        }


        /* =====================================================
           /roles
        ===================================================== */

        if (
            interaction.commandName ===
            "roles"
        ) {

            await interaction.reply(
                `🎭 **RÔLES DISPONIBLES**\n\n` +
                `🤡 **Wojak**\n` +
                `👹 **Troll**`
            );

            return;
        }


        /* =====================================================
           /userinfo
        ===================================================== */

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
                await interaction.guild.members
                    .fetch(user.id)
                    .catch(() => null);

            let roleCount = 0;

            if (member) {

                roleCount =
                    Math.max(
                        0,
                        member.roles.cache.size - 1
                    );

            }

            let joinedText = "";

            if (
                member &&
                member.joinedTimestamp
            ) {

                joinedText =
                    `\n📥 Arrivé sur le serveur : <t:${Math.floor(
                        member.joinedTimestamp / 1000
                    )}:F>`;
            }

            await interaction.reply(
                `👤 **INFORMATIONS UTILISATEUR**\n\n` +
                `🧑 Nom : **${user.username}**\n` +
                `🆔 ID : \`${user.id}\`\n` +
                `📅 Compte créé : <t:${Math.floor(
                    user.createdTimestamp / 1000
                )}:F>\n` +
                `🎭 Rôles : **${roleCount}**` +
                joinedText
            );

            return;
        }


        /* =====================================================
           /serverinfo
        ===================================================== */

        if (
            interaction.commandName ===
            "serverinfo"
        ) {

            const guild =
                interaction.guild;

            await interaction.reply(
                `🏠 **INFORMATIONS DU SERVEUR**\n\n` +
                `📛 Nom : **${guild.name}**\n` +
                `🆔 ID : \`${guild.id}\`\n` +
                `👥 Membres : **${guild.memberCount}**\n` +
                `💬 Salons : **${guild.channels.cache.size}**\n` +
                `🎭 Rôles : **${guild.roles.cache.size}**\n` +
                `👑 Propriétaire : <@${guild.ownerId}>\n` +
                `📅 Créé : <t:${Math.floor(
                    guild.createdTimestamp / 1000
                )}:F>`
            );

            return;
        }


        /* =====================================================
           /coinflip
        ===================================================== */

        if (
            interaction.commandName ===
            "coinflip"
        ) {

            const result =
                Math.random() < 0.5
                    ? "PILE 🪙"
                    : "FACE 🪙";

            await interaction.reply(
                `🪙 **La pièce tombe sur... ${result} !**`
            );

            return;
        }


        /* =====================================================
           /dice
        ===================================================== */

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
                `🎲 **D${faces}**\n\n` +
                `➡️ Résultat : **${result}**`
            );

            return;
        }


        /* =====================================================
           /ship
        ===================================================== */

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

            await interaction.reply(
                `❤️ **SHIP METER**\n\n` +
                `👤 ${user1}\n` +
                `❤️\n` +
                `👤 ${user2}\n\n` +
                `💘 Compatibilité : **${percentage}%**`
            );

            return;
        }


        /* =====================================================
           /say
        ===================================================== */

        if (
            interaction.commandName ===
            "say"
        ) {

            const text =
                interaction.options.getString(
                    "texte"
                );

            await interaction.reply({
                content: text,
                allowedMentions: {
                    parse: []
                }
            });

            return;
        }


        /* =====================================================
           /tts
        ===================================================== */

        if (
            interaction.commandName ===
            "tts"
        ) {

            const text =
                interaction.options.getString(
                    "texte"
                );

            await interaction.reply({
                content: text,
                tts: true,
                allowedMentions: {
                    parse: []
                }
            });

            return;
        }


        /* =====================================================
           /repo
        ===================================================== */

        if (
            interaction.commandName ===
            "repo"
        ) {

            const repoInput =
                interaction.options.getString(
                    "repo"
                ).trim();

            await interaction.deferReply();

            try {

                const repo =
                    repoInput
                        .replace(
                            /^https?:\/\/(www\.)?github\.com\//i,
                            ""
                        )
                        .replace(
                            /\/$/,
                            ""
                        );

                const response =
                    await fetch(
                        `https://api.github.com/repos/${repo}`,
                        {
                            headers: {
                                "User-Agent":
                                    "DAVID-BOT"
                            }
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `HTTP ${response.status}`
                    );

                }

                const data =
                    await response.json();

                await interaction.editReply(
                    `💻 **GITHUB REPOSITORY**\n\n` +
                    `📦 **${data.full_name}**\n` +
                    `⭐ Stars : **${data.stargazers_count}**\n` +
                    `🍴 Forks : **${data.forks_count}**\n` +
                    `🐛 Issues : **${data.open_issues_count}**\n` +
                    `📝 ${data.description || "Aucune description"}\n\n` +
                    `🔗 ${data.html_url}`
                );

            } catch (error) {

                await interaction.editReply(
                    "❌ Dépôt GitHub introuvable."
                );

            }

            return;
        }


        /* =====================================================
           /qr
        ===================================================== */

        if (
            interaction.commandName ===
            "qr"
        ) {

            const text =
                interaction.options.getString(
                    "texte"
                );

            const qr =
                `https://quickchart.io/qr?text=${encodeURIComponent(
                    text
                )}&size=500`;

            await interaction.reply(
                `🔳 **QR CODE**\n${qr}`
            );

            return;
        }


        /* =====================================================
           /ip
        ===================================================== */

        if (
            interaction.commandName ===
            "ip"
        ) {

            const input =
                interaction.options
                    .getString("ip")
                    .trim();

            await interaction.deferReply();

            try {

                let host =
                    input;

                let port =
                    null;


                const portMatch =
                    input.match(
                        /^(.+):([0-9]{1,5})$/
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
                            `❌ **Port invalide.**`
                        );

                        return;
                    }

                }


                const ipv4 =
                    /^(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})(\.(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2})){3}$/;


                const privateIP =
                    /^(10\.)|^(192\.168\.)|^(172\.(1[6-9]|2[0-9]|3[0-1])\.)/;


                if (
                    ipv4.test(host)
                ) {

                    if (
                        privateIP.test(host)
                    ) {

                        await interaction.editReply(
                            `🏠 **IP PRIVÉE**\n\n` +
                            `📡 IP : \`${host}\`` +
                            (
                                port
                                    ? `\n🎮 Port : \`${port}\``
                                    : ""
                            ) +
                            `\n🔒 Type : **IPv4 privée**\n\n` +
                            `Cette adresse appartient à un réseau local et n'est pas directement accessible depuis Internet.`
                        );

                        return;
                    }


                    const response =
                        await fetch(
                            `https://ipwho.is/${encodeURIComponent(
                                host
                            )}`
                        );

                    if (!response.ok) {

                        throw new Error(
                            `HTTP ${response.status}`
                        );

                    }

                    const data =
                        await response.json();

                    if (
                        !data.success
                    ) {

                        throw new Error(
                            "IP inconnue"
                        );

                    }


                    await interaction.editReply(
                        `🌐 **INFORMATIONS IP**\n\n` +
                        `📡 IP : \`${data.ip}\`` +
                        (
                            port
                                ? `\n🎮 Port : \`${port}\``
                                : ""
                        ) +
                        `\n🔒 Type : **IPv4 publique**\n` +
                        `🌍 Pays : **${data.country || "Inconnu"}**\n` +
                        `🏙️ Ville : **${data.city || "Inconnue"}**\n` +
                        `🗺️ Région : **${data.region || "Inconnue"}**\n` +
                        `📮 Code postal : **${data.postal || "Inconnu"}**\n` +
                        `🏢 Organisation : **${data.connection?.org || "Inconnue"}**\n` +
                        `📡 FAI : **${data.connection?.isp || "Inconnu"}**\n` +
                        `🕐 Fuseau : **${data.timezone?.id || "Inconnu"}**`
                    );

                    return;
                }


                const hostname =
                    /^(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?)$/;


                if (
                    !hostname.test(host)
                ) {

                    await interaction.editReply(
                        `❌ **Adresse invalide.**\n\n` +
                        `📡 Adresse testée : \`${input}\``
                    );

                    return;
                }


                const dnsResponse =
                    await fetch(
                        `https://dns.google/resolve?name=${encodeURIComponent(
                            host
                        )}&type=A`
                    );

                if (
                    !dnsResponse.ok
                ) {

                    throw new Error(
                        `DNS HTTP ${dnsResponse.status}`
                    );

                }

                const dnsData =
                    await dnsResponse.json();

                const answer =
                    dnsData.Answer?.find(
                        record =>
                            record.type === 1
                    );


                if (!answer) {

                    await interaction.editReply(
                        `❌ Impossible de trouver l'adresse IP de :\n\`${host}\``
                    );

                    return;
                }


                const resolvedIP =
                    answer.data;


                const response =
                    await fetch(
                        `https://ipwho.is/${encodeURIComponent(
                            resolvedIP
                        )}`
                    );

                if (
                    !response.ok
                ) {

                    throw new Error(
                        `IP API HTTP ${response.status}`
                    );

                }

                const data =
                    await response.json();


                await interaction.editReply(
                    `🎮 **SERVEUR / DOMAINE**\n\n` +
                    `🔗 Domaine : \`${host}\`\n` +
                    `📡 IP : \`${resolvedIP}\`` +
                    (
                        port
                            ? `\n🎮 Port : \`${port}\``
                            : ""
                    ) +
                    `\n🔒 Type : **IPv4 publique**\n` +
                    `🌍 Pays : **${data.country || "Inconnu"}**\n` +
                    `🏙️ Ville : **${data.city || "Inconnue"}**\n` +
                    `🗺️ Région : **${data.region || "Inconnue"}**\n` +
                    `🏢 Organisation : **${data.connection?.org || "Inconnue"}**\n` +
                    `📡 FAI : **${data.connection?.isp || "Inconnu"}**`
                );

            } catch (error) {

                console.error(
                    "❌ /ip :",
                    error
                );

                await interaction.editReply(
                    `❌ Impossible de récupérer les informations de cette adresse.\n\n` +
                    `📡 Adresse testée : \`${input}\``
                );

            }

            return;
        }

    }
);


/* =========================================================
   !ping
========================================================= */

client.on(
    "messageCreate",
    message => {

        if (
            message.author.bot
        ) {
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


/* =========================================================
   CONNEXION
========================================================= */

client.login(
    process.env.DISCORD_TOKEN
);
