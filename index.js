require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// ================= VARIABLES =================

const CHANNEL_ID = process.env.CHANNEL_ID;
const SERVER_IP = process.env.SERVER_IP;
const SERVER_PORT = process.env.SERVER_PORT;
const MODPACK_URL = process.env.MODPACK_URL;

let serverOnline = false;

// ================= READY =================

client.once("ready", async () => {

    console.log(`Bot encendido como ${client.user.tag}`);

    await registerCommands();

});

// ================= SLASH COMMANDS =================

async function registerCommands() {

    const commands = [

        new SlashCommandBuilder()
            .setName("startserver")
            .setDescription("Marcar servidor como ONLINE"),

        new SlashCommandBuilder()
            .setName("stopserver")
            .setDescription("Marcar servidor como OFFLINE"),

        new SlashCommandBuilder()
            .setName("status")
            .setDescription("Ver estado del servidor"),

        new SlashCommandBuilder()
            .setName("ip")
            .setDescription("Mostrar IP del servidor"),

        new SlashCommandBuilder()
            .setName("mods")
            .setDescription("Descargar modpack")

    ].map(cmd => cmd.toJSON());

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
    );

    console.log("Comandos registrados");
}

// ================= COMMAND HANDLER =================

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const channel = await client.channels.fetch(CHANNEL_ID);

    // ---------- START SERVER ----------
    if (interaction.commandName === "startserver") {

        if (serverOnline) {
            return interaction.reply("⚠️ El servidor ya está ONLINE");
        }

        serverOnline = true;

        const embed = new EmbedBuilder()
            .setTitle("🟢 Servidor ONLINE")
            .setDescription("El servidor **Obsidian Network** está activo")
            .addFields({
                name: "IP",
                value: `${SERVER_IP}:${SERVER_PORT}`
            })
            .setColor(0x57F287)
            .setTimestamp();

        channel.send({ embeds: [embed] });

        return interaction.reply({ content: "Servidor marcado como ONLINE", ephemeral: true });
    }

    // ---------- STOP SERVER ----------
    if (interaction.commandName === "stopserver") {

        if (!serverOnline) {
            return interaction.reply("⚠️ El servidor ya está OFFLINE");
        }

        serverOnline = false;

        const embed = new EmbedBuilder()
            .setTitle("🔴 Servidor OFFLINE")
            .setDescription("El servidor **Obsidian Network** está apagado")
            .setColor(0xED4245)
            .setTimestamp();

        channel.send({ embeds: [embed] });

        return interaction.reply({ content: "Servidor marcado como OFFLINE", ephemeral: true });
    }

    // ---------- STATUS ----------
    if (interaction.commandName === "status") {

        if (serverOnline) {
            return interaction.reply("🟢 Servidor ONLINE");
        }

        return interaction.reply("🔴 Servidor OFFLINE");
    }

    // ---------- IP ----------
    if (interaction.commandName === "ip") {

        return interaction.reply(
            `📡 IP del servidor:\n\`${SERVER_IP}:${SERVER_PORT}\``
        );
    }

    // ---------- MODS ----------
    if (interaction.commandName === "mods") {

        return interaction.reply(
            `📦 Descarga el modpack:\n${MODPACK_URL}`
        );
    }

});

client.login(process.env.TOKEN);
