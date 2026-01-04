const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Zmienna przechowująca punkty (w pamięci - po restarcie się zerują, w pełnej wersji warto użyć bazy danych)
const userPoints = new Map();

client.once('ready', () => {
    console.log(`✅ Zalogowano jako ${client.user.tag}!`);
    console.log('🤖 Bot Kick AI jest gotowy do działania.');

    // Ustawienie statusu - Teraz pokazuje link do Kicka
    client.user.setActivity('🟢 Kick.com/Pulsif | !pomoc', { type: 3 }); // 3 = Watching

    console.log('--- Instrukcja Uruchomienia ---');
    console.log('1. Upewnij się, że masz Node.js');
    console.log('2. Zaproś bota na serwer przez Developer Portal');
    console.log('3. Bot teraz nasłuchuje...');
});

// Powitanie nowych użytkowników
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name.includes('powitania') || ch.name.includes('general'));
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`Witaj ${member.user.username}!`)
        .setDescription(`Cześć na serwerze **${member.guild.name}**! 👋\n\nNie zapomnij sprawdzić kanału z zasadami i wbijaj na streamy!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

    channel.send({ content: `${member}`, embeds: [embed] });
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    // Prosty system punktów za aktywność
    const userId = message.author.id;
    const points = userPoints.get(userId) || 0;
    userPoints.set(userId, points + 1);

    // Obsługa komend
    if (!message.content.startsWith(config.PREFIX)) return;

    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Komenda: !pomoc
    if (command === 'pomoc') {
        const embed = new EmbedBuilder()
            .setColor(0x00FF00) // Neon Green
            .setTitle('🤖 Bot Kick AI - Komendy')
            .setDescription('Oto lista dostępnych komend:')
            .addFields(
                { name: '!live [link]', value: 'Wysyła powiadomienie o streamie (dla adminów)' },
                { name: '!punkty', value: 'Sprawdza Twoją aktywność na czacie' },
                { name: '!pulsif', value: 'Link do strony Pulsif.pl' }
            )
            .setFooter({ text: 'Pulsif Bot' });

        message.channel.send({ embeds: [embed] });
    }

    // Komenda: !live [link]
    if (command === 'live') {
        // Sprawdź czy użytkownik ma uprawnienia (np. administrator)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ Nie masz uprawnień do tej komendy.');
        }

        const link = args[0];
        if (!link) {
            return message.reply('❌ Podaj link do streama! Np. `!live https://kick.com/twojkanal`');
        }

        message.channel.send(`@everyone\n🚨 **LIVE ODPALONY!** 🚨\n\nWbijajcie na Kicka! Dzieje się!\n👉 ${link}`);
        // Usuń wiadomość z komendą dla czystości
        message.delete().catch(console.error);
    }

    // Komenda: !punkty
    if (command === 'punkty') {
        const points = userPoints.get(userId) || 0;
        message.reply(`🏆 Twoje punkty aktywności: **${points}**`);
    }

    // Komenda: !pulsif
    if (command === 'pulsif') {
        message.reply('Nasz projekt: https://pulsif.pl - Graj i Zarabiaj!');
    }
});

// Logowanie bota
if (config.TOKEN === "TUTAJ_WKLEJ_SWOJ_NOWY_TOKEN_OD_DISCORD") {
    console.error("❌ BŁĄD: Nie uzupełniłeś tokenu w pliku config.json!");
} else {
    client.login(config.TOKEN);
}
