// === Card data ===
const CARDS = [
  { name: "Soggy Brainrot", rarity: "common", basePrice: 5 },
  { name: "Cracked Mindworm", rarity: "common", basePrice: 6 },
  { name: "Gleaming Synapse", rarity: "rare", basePrice: 25 },
  { name: "Neon Hallucina", rarity: "rare", basePrice: 30 },
  { name: "Void Overlord", rarity: "epic", basePrice: 120 },
  { name: "Eternal Brainstorm", rarity: "legendary", basePrice: 600 }
];

const RARITY_DISTRIBUTION = [
  { rarity: "common", chance: 0.75 },
  { rarity: "rare", chance: 0.2 },
  { rarity: "epic", chance: 0.04 },
  { rarity: "legendary", chance: 0.01 }
];

// === Player state ===
let player = JSON.parse(localStorage.getItem("player")) || {
  balance: 1000,
  inventory: []
};

let packAvailable = false;
let openedPack = [];
let currentIndex = 0;

const balanceEl = document.getElementById("balance");
const invList = document.getElementById("inventory-list");
const packEl = document.getElementById("pack");
const cardViewer = document.getElementById("card-viewer");
const cardEl = document.getElementById("card");
const nextBtn = document.getElementById("next-card");

function save() { localStorage.setItem("player", JSON.stringify(player)); }

function weightedPick(dist) {
  const r = Math.random();
  let acc = 0;
  for (const d of dist) {
    acc += d.chance;
    if (r <= acc) return d.rarity;
  }
  return "common";
}

function openPackCards() {
  const pack = [];
  for (let i = 0; i < 5; i++) {
    const rarity = weightedPick(RARITY_DISTRIBUTION);
    const pool = CARDS.filter(c => c.rarity === rarity);
    const card = { ...pool[Math.floor(Math.random() * pool.length)], id: Date.now() + Math.random() };
    pack.push(card);
    player.inventory.push(card);
  }
  save();
  return pack;
}

function showInventory() {
  invList.innerHTML = "";
  if (player.inventory.length === 0) {
    invList.innerHTML = "<p>(empty)</p>";
    return;
  }
  player.inventory.forEach(c => {
    const div = document.createElement("div");
    div.className = `inv-card ${c.rarity}`;
    div.innerHTML = `<strong>${c.name}</strong><br><em>${c.rarity}</em>`;
    invList.appendChild(div);
  });
}

function showCard() {
  const card = openedPack[currentIndex];
  cardEl.className = `reveal ${card.rarity}`;
  cardEl.innerHTML = `<strong>${card.name}</strong><br><em>${card.rarity}</em>`;
  balanceEl.textContent = player.balance;
}

// === Event handlers ===
document.getElementById("buy-pack").onclick = () => {
  if (player.balance < 100) {
    alert("Not enough coins!");
    return;
  }
  if (packAvailable) {
    alert("You already have a pack ready — open it first!");
    return;
  }
  player.balance -= 100;
  packAvailable = true;
  save();
  balanceEl.textContent = player.balance;
  alert("Pack purchased! Click the pack to open it.");
};

packEl.onclick = () => {
  if (!packAvailable) {
    alert("Buy a pack first!");
    return;
  }
  if (packEl.classList.contains("opening")) return;

  packEl.classList.add("opening");
  setTimeout(() => {
    packEl.classList.add("hidden");
    openedPack = openPackCards();
    currentIndex = 0;
    showCard();
    cardViewer.classList.remove("hidden");
    packAvailable = false;
  }, 600);
};

nextBtn.onclick = () => {
  currentIndex++;
  if (currentIndex < openedPack.length) {
    showCard();
  } else {
    cardViewer.classList.add("hidden");
    packEl.classList.remove("opening", "hidden");
    showInventory();
  }
};

document.getElementById("reset").onclick = () => {
  if (confirm("Reset progress?")) {
    localStorage.removeItem("player");
    player = { balance: 1000, inventory: [] };
    packAvailable = false;
    showInventory();
    balanceEl.textContent = player.balance;
  }
};

// === Init ===
showInventory();
balanceEl.textContent = player.balance;
