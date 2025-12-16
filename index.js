const express = require("express");
const qrcode = require("qrcode-terminal");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

// Simple web server for Render
app.get("/", (req, res) => {
  res.send("✅ Trouble XMD Bot is running");
});

app.listen(PORT, () => {
  console.log("🌍 Server running on port " + PORT);
});

// WhatsApp bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr, connection } = update;

    if (qr) {
      console.log("📱 Scan this QR to connect:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ Trouble XMD connected successfully");
    }

    if (connection === "close") {
      console.log("❌ Connection closed, restarting...");
      startBot();
    }
  });
}

startBot();
