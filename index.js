const express = require("express");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

// Web server (required by Render)
app.get("/", (req, res) => {
  res.send("✅ Trouble XMD Bot is running");
});

app.listen(PORT, () => {
  console.log("🌍 Server running on port " + PORT);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "open") {
      console.log("✅ Trouble XMD connected successfully");
    }

    if (connection === "close") {
      console.log("❌ Connection closed, restarting...");
      startBot();
    }
  });

  // 🔑 Generate Pair Code
  if (!state.creds.registered) {
    const phoneNumber = process.env.PAIR_NUMBER;
    if (!phoneNumber) {
      console.log("❌ Set PAIR_NUMBER environment variable");
      return;
    }

    const code = await sock.requestPairingCode(phoneNumber);
    console.log("🔗 Pair Code:", code);
    console.log("📱 Enter this code in WhatsApp → Linked Devices");
  }
}

startBot();
