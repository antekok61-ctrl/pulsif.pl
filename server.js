const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Hostuje pliki z folderu public
app.use(express.static('public'));
app.use(express.json());

// API: Start Bota
app.post('/api/start-bot', (req, res) => {
    const channel = req.body.channel;
    console.log(`[BOT] Uruchamianie dla kanału: ${channel}`);

    // Tutaj w przyszłości wepniemy prawdziwy kod bota (Puppeteer)
    // Na razie symulujemy sukces, żeby UI działało
    res.json({ message: `Bot Kick AI został uruchomiony dla kanału: ${channel}!` });
});

// API: Zatrzymaj Bota
app.post('/api/stop-bot', (req, res) => {
    console.log(`[BOT] Zatrzymano.`);
    res.json({ message: "Zatrzymano" });
});

// API: Otwórz Monitor (tzw. Viewbot - po prostu otwiera przeglądarkę)
app.post('/api/open-monitor', (req, res) => {
    const channel = req.body.channel;
    const url = `https://kick.com/${channel}`;
    console.log(`[MONITOR] Otwieranie: ${url}`);

    // Komenda systemowa do otwarcia przeglądarki
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    exec(`${start} ${url}`);

    res.json({ message: "Monitor otwarty" });
});

// Start serwera
app.listen(port, () => {
    console.log(`✅ Pulsif App działa na http://localhost:${port}`);
    console.log(`🚀 Otwieram aplikację w przeglądarce...`);

    // Auto-otwarcie aplikacji po starcie
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    exec(`${start} http://localhost:${port}`);
});
