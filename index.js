const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const GUILD_ID = "1550531386295718060";
const ROLE_ID = "1550591165919657998";

client.once("ready", async () => {
    console.log("========================================");
    console.log("        DAVID RGB - TEST");
    console.log("========================================");

    console.log(`🤖 Bot : ${client.user.tag}`);
    console.log(`🆔 Bot ID : ${client.user.id}`);
    console.log(`🏠 Serveur : ${GUILD_ID}`);
    console.log(`🎨 Rôle : ${ROLE_ID}`);

    try {
        // Récupération du serveur
        const guild = await client.guilds.fetch(GUILD_ID);

        if (!guild) {
            console.log("❌ Serveur introuvable.");
            return;
        }

        console.log(`✅ Serveur trouvé : ${guild.name}`);

        // Récupération du rôle
        const role = await guild.roles.fetch(ROLE_ID);

        if (!role) {
            console.log("❌ Rôle introuvable.");
            return;
        }

        console.log("");
        console.log("========== INFORMATIONS RÔLE ==========");
        console.log(`📛 Nom       : ${role.name}`);
        console.log(`🆔 ID        : ${role.id}`);
        console.log(`📊 Position  : ${role.position}`);
        console.log(`🔧 Modifiable: ${role.editable}`);
        console.log(`🎨 Couleur   : ${role.hexColor}`);
        console.log("=======================================");
        console.log("");

        // Récupération du membre DAVID RGB
        const me = await guild.members.fetch(client.user.id);

        if (!me) {
            console.log("❌ Membre DAVID RGB introuvable.");
            return;
        }

        console.log("========== DAVID RGB ==========");
        console.log(`🤖 Nom : ${me.user.tag}`);
        console.log(`📊 Rôle le plus haut : ${me.roles.highest.name}`);
        console.log(`📊 Position : ${me.roles.highest.position}`);
        console.log(`🔑 Manage Roles : ${me.permissions.has("ManageRoles")}`);
        console.log("================================");
        console.log("");

        // Vérification de la hiérarchie
        if (me.roles.highest.position <= role.position) {
            console.log("⚠️ ATTENTION");
            console.log("DAVID RGB est au même niveau ou sous le rôle cible.");
            console.log("Discord devrait donc refuser la modification.");
            console.log("");
        } else {
            console.log("✅ Hiérarchie correcte.");
            console.log("DAVID RGB est au-dessus du rôle cible.");
            console.log("");
        }

        // Vérification permission
        if (!me.permissions.has("ManageRoles")) {
            console.log("❌ DAVID RGB n'a pas la permission Manage Roles.");
            return;
        }

        console.log("🎨 Tentative de changement de couleur...");
        console.log("➡️ Rouge (#FF0000)");

        // TEST
        await role.setColors({
            primaryColor: 0xFF0000
        });

        console.log("");
        console.log("========================================");
        console.log("✅ TEST RÉUSSI !");
        console.log("========================================");
        console.log("🎨 Le rôle 𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭 est maintenant rouge.");
        console.log("========================================");

    } catch (error) {
        console.log("");
        console.log("========================================");
        console.log("❌ TEST ÉCHOUÉ");
        console.log("========================================");

        console.error("Type :", error.name);
        console.error("Message :", error.message);

        if (error.code) {
            console.error("Discord Code :", error.code);
        }

        console.log("");
        console.log("Causes possibles :");
        console.log("1. DAVID RGB est sous le rôle 𝐃𝐚𝐯𝐢𝐝 𝐛𝐨𝐭");
        console.log("2. DAVID RGB n'a pas Manage Roles");
        console.log("3. Le rôle cible est géré par une intégration");
        console.log("4. L'ID du rôle ou du serveur est incorrect");
        console.log("========================================");
    }
});

client.on("error", (error) => {
    console.error("❌ Erreur Discord :", error);
});

process.on("unhandledRejection", (error) => {
    console.error("❌ Promise non gérée :", error);
});

client.login(process.env.DISCORD_TOKEN);
