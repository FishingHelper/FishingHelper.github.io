// === Brainrot Pack Opener ===

// 💥 Card List
const CARDS = [
  // Common
  { name: "Noobini Pizzanini", rarity: "common", basePrice: 5 },
  { name: "Frigo Camelo", rarity: "common", basePrice: 5 },
  { name: "Trippi Troppi", rarity: "common", basePrice: 6 },
  { name: "Bobrito Bandito", rarity: "common", basePrice: 5 },
  { name: "Fruli Frula", rarity: "common", basePrice: 6 },
  { name: "Pipi Avocado", rarity: "common", basePrice: 5 },
  { name: "Talpa Di Ferro", rarity: "common", basePrice: 5 },
  { name: "Blueberrinni Octopussini", rarity: "common", basePrice: 5 },
  { name: "Burbaloni Lulilolli", rarity: "common", basePrice: 6 },
  { name: "Boneca Ambalabu", rarity: "common", basePrice: 5 },
  { name: "Ballerino Lololo", rarity: "common", basePrice: 5 },
  { name: "Espressona Signora", rarity: "common", basePrice: 6 },
  { name: "Gorillini Bananini", rarity: "common", basePrice: 5 },
  { name: "Piccione Macchina", rarity: "common", basePrice: 5 },

  // Rare
  { name: "Cappuccino Assassino", rarity: "rare", basePrice: 25 },
  { name: "Ballerina Cappuccina", rarity: "rare", basePrice: 30 },
  { name: "Chimpanzini Bananini", rarity: "rare", basePrice: 28 },
  { name: "Bombombini Gusini", rarity: "rare", basePrice: 27 },
  { name: "Brr Brr Patapim", rarity: "rare", basePrice: 29 },
  { name: "La Vaca Saturno Saturnita", rarity: "rare", basePrice: 30 },

  // Epic
  { name: "Lirilì Larilà", rarity: "epic", basePrice: 110 },
  { name: "Girafa Celestre", rarity: "epic", basePrice: 125 },
  { name: "Glorbo Fruttodrillo", rarity: "epic", basePrice: 135 },

  // Legendary
  { name: "Tralalero Tralala", rarity: "legendary", basePrice: 500 },
  { name: "Bombardiro Crocodilo", rarity: "legendary", basePrice: 550 },
  { name: "Tung Tung Tung Sahur", rarity: "legendary", basePrice: 480 },

  // Mythic
  { name: "Nuclearo Dinossauro", rarity: "mythic", basePrice: 2500 },
  { name: "Strawberry Elephant", rarity: "mythic", basePrice: 2650 },
  { name: "Sigma Gyatt Rizzler", rarity: "mythic", basePrice: 2800 }
];

// 🎮 Player Data
let player = {
  balance: 100,
  inventory: []
};

let openedPack = [];
let currentIndex = 0;

// === Elements ===
const balanceEl = document.getElementById("balance");
const cardEl = document.getElementById("card");
const inventoryEl = document.getElementById("inventory");
const openPackBtn = document.getElementById("open-pack");
const nextBtn = document.getElementById("next-card");
const sellBtn = document.getElementById("sell-card");
const cheatBtn = document.getElementById("buy-pack");
const redeemInput = document.getElementById("redeem-code");
const redeemBtn = document.getElementById("redeem-btn");
const redeemMsg = document.getElementById("redeem-msg");

// === Update UI ===
function updateBalance() {
  balanceEl.textContent = player.balance;
}

function updateInventory() {
  inventoryEl.innerHTML = "";
  player.inventory.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = `inv-card ${c.rarity}`;
    div.innerHTML = `
      <strong>${c.name}</strong><br>
      <small>${c.rarity.toUpperCase()} | 💰${c.basePrice}</small>
    `;
    div.onclick = () => {
      if (confirm(`Sell ${c.name} for ${c.basePrice}🧠?`)) {
        player.balance += c.basePrice;
        player.inventory.splice(i, 1);
        updateInventory();
        updateBalance();
      }
    };
    inventoryEl.appendChild(div);
  });
}

// === Pack Logic ===
function openPack() {
  const cost = 100;
  if (player.balance < cost) {
    alert("Not enough braincells 🧠");
    return;
  }

  player.balance -= cost;
  updateBalance();

  openedPack = Array.from({ length: 5 }, getRandomCard);
  currentIndex = 0;
  showCard();
}

function getRandomCard() {
  const chance = Math.random();
  if (chance < 0.6) return randomByRarity("common");
  if (chance < 0.85) return randomByRarity("rare");
  if (chance < 0.95) return randomByRarity("epic");
  if (chance < 0.995) return randomByRarity("legendary");
  return randomByRarity("mythic");
}

function randomByRarity(rarity) {
  const cards = CARDS.filter(c => c.rarity === rarity);
  return cards[Math.floor(Math.random() * cards.length)];
}

function showCard() {
  if (!openedPack.length) {
    cardEl.textContent = "Pack complete!";
    cardEl.className = "card";
    return;
  }
  const card = openedPack[currentIndex];
  cardEl.innerHTML = `
    <strong>${card.name}</strong><br>
    <small>${card.rarity.toUpperCase()} | 💰${card.basePrice}</small>
  `;
  cardEl.className = `card ${card.rarity}`;
}

// === Buttons ===
openPackBtn.onclick = openPack;

nextBtn.onclick = () => {
  if (!openedPack.length) return;

  // Add to inventory before moving on
  const currentCard = openedPack[currentIndex];
  player.inventory.push(currentCard);
  updateInventory();

  // Remove from pack
  openedPack.splice(currentIndex, 1);

  showCard();
};

sellBtn.onclick = () => {
  if (!openedPack.length) return;
  const card = openedPack[currentIndex];
  player.balance += card.basePrice;
  updateBalance();
  openedPack.splice(currentIndex, 1);
  showCard();
};

cheatBtn.onclick = () => {
  player.balance += 100;
  updateBalance();
};

// === Redeem Code System ===
const CODES = {
  "ULTIMATEBRAIN": { name: "Sigma Gyatt Rizzler", rarity: "mythic", basePrice: 2800 },
  "SUPERBRAIN": { name: "Bombardiro Crocodilo", rarity: "legendary", basePrice: 550 },
  "EPICBRAIN": { name: "Glorbo Fruttodrillo", rarity: "epic", basePrice: 135 }
};

redeemBtn.onclick = () => {
  const code = redeemInput.value.toUpperCase().trim();
  if (CODES[code]) {
    const card = CODES[code];
    player.inventory.push(card);
    updateInventory();
    redeemMsg.textContent = `✅ You got ${card.name} (${card.rarity.toUpperCase()})!`;
    redeemMsg.style.color = "lime";
    redeemInput.value = "";
  } else {
    redeemMsg.textContent = "❌ Invalid code!";
    redeemMsg.style.color = "red";
  }
};

// === Init ===
updateBalance();
updateInventory();
