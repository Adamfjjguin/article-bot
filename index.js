const axios = require("axios");
const fs = require("fs-extra");

const TELEGRAM_TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const SEEN_FILE = "./seen.json";

// 🔥 Marques
const brands = ["nike", "niké", "nikee", "n1ke", "under armour", "ua"];

// 🔥 Termes performance
const performanceTerms = [
  "running","run division","rdv","dri fit","aeroswift",
  "trail","storm","shield","windrunner","race",
  "marathon","phenom","elite","tech","tech fleece",
  "tech knit","hybrid","rush","speedpocket"
];

// 📊 Chargement doublons persistants
async function loadSeen() {
  return await fs.readJson(SEEN_FILE);
}

async function saveSeen(data) {
  await fs.writeJson(SEEN_FILE, data);
}

// 🎯 Simulation dynamique
function simulateFetch() {
  const sample = [
    "Nike Phenom Elite Running Pant",
    "UA Hybrid Storm Jacket",
    "Nike Tech Fleece Jogger",
    "Nike Marathon Aeroswift Pant",
    "Under Armour Speedpocket Run"
  ];

  return sample.map((title, index) => ({
    id: Date.now() + index,
    title,
    price: Math.floor(Math.random() * 60),
    currency: index % 2 === 0 ? "GBP" : "PLN",
    country: index % 2 === 0 ? "UK" : "PL",
    image: "https://via.placeholder.com/300",
    link: "https://example.com/item" + index
  }));
}

// 🧠 Score intelligent
function calculateScore(title) {
  const lower = title.toLowerCase();
  let score = 0;

  brands.forEach(b => {
    if (lower.includes(b)) score += 2;
  });

  performanceTerms.forEach(t => {
    if (lower.includes(t)) score += 3;
  });

  return score;
}

// 🔎 Matching
function matches(title) {
  const lower = title.toLowerCase();
  return brands.some(b => lower.includes(b)) &&
         performanceTerms.some(t => lower.includes(t));
}

// 📤 Telegram
async function sendPhoto(item, score) {
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
    chat_id: CHAT_ID,
    photo: item.image,
    caption:
      `🔥 ${item.title}\n` +
      `💰 ${item.price} ${item.currency}\n` +
      `⭐ Score: ${score}\n` +
      `🌍 ${item.country}\n` +
      `🔗 ${item.link}`
  });
}

// 🔄 Check principal
async function check() {
  console.log("🔍 Checking simulation...");

  const seen = await loadSeen();
  const items = simulateFetch();

  for (let item of items) {

    const priceLimit = item.country === "UK" ? 40 : 200;
    const score = calculateScore(item.title);

    if (
      matches(item.title) &&
      item.price <= priceLimit &&
      score >= 5 &&
      !seen.includes(item.id)
    ) {
      console.log("✅ Found:", item.title);

      await sendPhoto(item, score);

      seen.push(item.id);
      await saveSeen(seen);
    }
  }
}

setInterval(check, 60000);

console.log("🚀 School simulation bot started");
