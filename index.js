// Import required modules
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const express = require('express');

// Start the WhatsApp bot
async function startBot() {
    try {
        // Create auth state folder
        const { state, saveCreds } = await useMultiFileAuthState('auth');

        // Get latest Baileys version
        const { version } = await fetchLatestBaileysVersion();

        // Create socket
        const sock = makeWASocket({
            version,
            auth: state,
        });

        // Connection updates
        sock.ev.on('connection.update', (update) => {
            const { qr, connection } = update;

            if (qr) {
                // Print QR code in console for scanning
                qrcode.generate(qr, { small: true });
                console.log('Scan this QR code with WhatsApp to connect your bot.');
            }

            console.log('Connection status:', connection);
        });

        // Save credentials on update
        sock.ev.on('creds.update', saveCreds);

    } catch (error) {
        console.error('Bot startup error:', error);
    }
}

// Run the bot
startBot();

// Express server to keep Render happy
const app = express();
app.get('/', (req, res) => res.send('Trouble XMD Bot is running!'));
app.listen(process.env.PORT || 3000, () => console.log('Server listening on port', process.env.PORT || 3000));
