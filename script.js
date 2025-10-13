// === Brainrot Pack Opener ===

// --- Card Database ---
const CARDS = [
  // --- Common (Rarity: 5) ---
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

  // --- Rare (Rarity: 25-30) ---
  { name: "Cappuccino Assassino", rarity: "rare", basePrice: 25 },
  { name: "Ballerina Cappuccina", rarity: "rare", basePrice: 30 },
  { name: "Chimpanzini Bananini", rarity: "rare", basePrice: 28 },
  { name: "Bombombini Gusini", rarity: "rare", basePrice: 27 },
  { name: "Brr Brr Patapim", rarity: "rare", basePrice: 29 },
  { name: "La Vaca Saturno Saturnita", rarity: "rare", basePrice: 30 },

  // --- Epic (Rarity: ~120) ---
  { name: "Lirilì Larilà", rarity: "epic", basePrice: 110 },
  { name: "Girafa Celestre", rarity: "epic", basePrice: 125 },
  { name: "Glorbo Fruttodrillo", rarity: "epic", basePrice: 135 },

  // --- Legendary (Rarity: ~500) ---
  { name: "Tralalero Tralala", rarity: "legendary", basePrice: 500 },
  { name: "Bombardiro Crocodilo", rarity: "legendary", basePrice: 550 },
  { name: "Tung Tung Tung Sahur", rarity: "legendary", basePrice: 480 },

  // --- Mythic (Rarity: ~2500) ---
  { name: "Nuclearo Dinossauro", rarity: "mythic", basePrice: 2500 },
  { name: "Strawberry Elephant", rarity: "mythic", basePrice: 2650 },
  { name: "Sigma Gyatt Rizzler", rarity: "mythic", basePrice: 2800 }
];

// --- Player Data ---
const player = {
  balance: 500,
  inventory: []
};

// --- Elements ---
const openBtn = document.getElementById("open-pack");
const cardEl = document.getElementById("card");
const nextBtn = document.getElementById("next-card");
const sellBtn = document.getElementById("sell-card");
const balanceEl = document.getElementById("balance");
const invList = document.getElementById("inventory");
const buyBtn = document.getElementById("buy-pack");

// --- Config ---
const PACK_PRICE = 100;
let openedPack = [];
let currentIndex = 0;

// --- Rarity Odds ---
function getRandomCard() {
  const roll = Math.random() * 100;
  if (roll < 65) return randomFrom("common");
  if (roll < 90) return randomFrom("rare");
  if (roll < 98) return randomFrom("epic");
  if (roll < 99.5) return randomFrom("legendary");
  return randomFrom("mythic");
}

function randomFrom(rarity) {
  const pool = CARDS.filter(c => c.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Pack Opening ---
function openPack() {
  if (player.balance < PACK_PRICE) {
    alert("Not enough braincoins!");
    return;
  }
  player.balance -= PACK_PRICE;
  openedPack = Array.from({ length: 5 }, getRandomCard);
  currentIndex = 0;
  showCard();
}

// --- Display Current Card ---
function showCard() {
  const card = openedPack[currentIndex];
  cardEl.className = `card ${card.rarity}`;
  cardEl.innerHTML = `
    <strong>${card.name}</strong><br>
    <em>${card.rarity.toUpperCase()}</em><br>
    <small>Value: ${card.basePrice}🧠</small>
  `;
  balanceEl.textContent = player.balance;
}

// --- Sell Current Card ---
function sellCard() {
  const card = openedPack[currentIndex];
  if (!card) return;
  const sellPrice = Math.floor(card.basePrice * 0.8);
  player.balance += sellPrice;
  openedPack.splice(currentIndex, 1);
  if (openedPack.length > 0) {
    currentIndex = currentIndex % openedPack.length;
    showCard();
  } else {
    cardEl.textContent = "All cards sold!";
  }
  balanceEl.textContent = player.balance;
  updateInventory();
}

// --- Save Card to Inventory ---
function keepCard() {
  const card = openedPack[currentIndex];
  player.inventory.push(card);
  openedPack.splice(currentIndex, 1);
  if (openedPack.length > 0) {
    currentIndex = currentIndex % openedPack.length;
    showCard();
  } else {
    cardEl.textContent = "Pack complete!";
  }
  updateInventory();
}

// --- Update Inventory Display ---
function updateInventory() {
  invList.innerHTML = "";
  player.inventory.forEach(c => {
    const div = document.createElement("div");
    div.className = `inv-card ${c.rarity}`;
    div.innerHTML = `<strong>${c.name}</strong><br><em>${c.rarity}</em>`;
    invList.appendChild(div);
  });
  balanceEl.textContent = player.balance;
}

// --- Button Events ---
openBtn.onclick = openPack;
nextBtn.onclick = () => {
  if (!openedPack.length) return;

  // Save current card before moving on
  const currentCard = openedPack[currentIndex];
  player.inventory.push(currentCard);
  updateInventory();

  // Remove the card we just added to inventory
  openedPack.splice(currentIndex, 1);

  if (openedPack.length > 0) {
    currentIndex = currentIndex % openedPack.length;
    showCard();
  } else {
    cardEl.textContent = "Pack complete!";
  }
};

sellBtn.onclick = sellCard;
buyBtn.onclick = () => {
  player.balance += 100;
  balanceEl.textContent = player.balance;
  alert("You gained 100🧠 (test cheat)");
};

// --- Init ---
balanceEl.textContent = player.balance;
updateInventory();
