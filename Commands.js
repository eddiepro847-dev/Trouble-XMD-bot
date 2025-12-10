// Trouble XMD Bot - Command File
// Safe for teenagers & beginner friendly 🚀

const jokes = [
  "Why don’t robots have brothers? Because they all share the same motherboard!",
  "How do computers freshen their breath? With Bluetooth!",
  "Why did the smartphone go to school? It wanted to be smarter!"
];

const facts = [
  "Honey never spoils, even after thousands of years!",
  "Sharks existed before trees!",
  "Your brain is sometimes more active when you’re asleep!"
];

function isAdmin(participants, sender) {
  const participant = participants.find(p => p.id === sender);
  return participant?.admin === "admin" || participant?.admin === "superadmin";
}

module.exports = async (sock, m) => {
  const body =
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    "";
  const text = body.toLowerCase();
  const jid = m.key.remoteJid;

  // HELP MENU
  if (text === ".help") {
    await sock.sendMessage(jid, {
      text: `
🔥 Trouble XMD Bot Commands

🎮 Fun:
• .joke
• .fact
• .meme (coming soon)
• .rate <name>

🧰 Tools:
• .ping
• .time
• .calc <1+1>
• .info

👑 Admin (groups only):
• .kick @user
• .promote @user
• .demote @user

⚙ Owner:
• .restart (your number only)

More soon! 😎
      `
    });
  }

  // PING
  if (text === ".ping") {
    const start = Date.now();
    await sock.sendMessage(jid, { text: "Checking...⏳" });
    const end = Date.now();
    await sock.sendMessage(jid, { text: `Pong! 🏓 ${end - start} ms` });
  }

  // TIME
  if (text === ".time") {
    const now = new Date().toLocaleString();
    await sock.sendMessage(jid, { text: `⏱️ Current Time: ${now}` });
  }

  // FACT
  if (text === ".fact") {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await sock.sendMessage(jid, { text: `💡 ${fact}` });
  }

  // JOKE
  if (text === ".joke") {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(jid, { text: `😂 ${joke}` });
  }

  // RATE
  if (text.startsWith(".rate")) {
    const name = text.split(" ").slice(1).join(" ");
    if (!name) return;
    const rate = Math.floor(Math.random() * 100) + 1;
    await sock.sendMessage(jid, { text: `I rate **${name}**: ${rate}/100 🎯` });
  }

  // CALCULATOR
  if (text.startsWith(".calc")) {
    const problem = text.replace(".calc", "").trim();
    try {
      const result = eval(problem);
      await sock.sendMessage(jid, { text: `🧮 ${problem} = ${result}` });
    } catch {
      await sock.sendMessage(jid, { text: "Error in calculation ❌" });
    }
  }

  // INFO
  if (text === ".info") {
    await sock.sendMessage(jid, {
      text: "🤖 Trouble XMD Bot — Powered by Baileys & you! 🚀"
    });
  }

  // --- GROUP ADMIN COMMANDS (SAFE) ---

  const isGroup = jid.endsWith("@g.us");
  const sender = m.key.participant || m.key.remoteJid;

  if (text.startsWith(".kick") && isGroup) {
    const metadata = await sock.groupMetadata(jid);
    if (!isAdmin(metadata.participants, sender)) return;

    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return;

    await sock.groupParticipantsUpdate(jid, mentioned, "remove");
    await sock.sendMessage(jid, { text: "Removed successfully 👋" });
  }

  if (text.startsWith(".promote") && isGroup) {
    const metadata = await sock.groupMetadata(jid);
    if (!isAdmin(metadata.participants, sender)) return;

    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return;

    await sock.groupParticipantsUpdate(jid, mentioned, "promote");
    await sock.sendMessage(jid, { text: "Promoted to admin 👑" });
  }

  if (text.startsWith(".demote") && isGroup) {
    const metadata = await sock.groupMetadata(jid);
    if (!isAdmin(metadata.participants, sender)) return;

    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid;
    if (!mentioned) return;

    await sock.groupParticipantsUpdate(jid, mentioned, "demote");
    await sock.sendMessage(jid, { text: "Removed admin rights ❌" });
  }
};
