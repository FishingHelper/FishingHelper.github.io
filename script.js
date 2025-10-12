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
function save() { localStorage.setItem("player", JSON.stringify(player)); }

// === UI elements ===
const packEl = document.getElementById("pack");
const balanceEl = document.getElementById("balance");
const invList = document.getElementById("inventory-list");
const cardViewer = document.getElementById("card-viewer");
const cardEl = document.getElementById("card");
const nextBtn = document.getElementById("next-card");

let openedPack = [];
let currentIndex = 0;

// === Game logic ===
function weightedPick(dist) {
  const r = Math.random();
  let acc = 0;
  for (const item of dist) {
    acc += item.chance;
    if (r <= acc) return item.rarity;
  }
  return "common";
}

function openPack() {
  const pack = [];
  for (let i = 0; i < 5; i++) {
    const rarity = weightedPick(RARITY_DISTRIBUTION);
    const pool = CARDS.filter(c => c.rarity === rarity);
    const card = { ...pool[Math.floor(Math.random() * pool.length)], id: Date.now() + Math.random() };
    pack.push(card);
    player.inventory.push(card);
  }
  player.balance -= 100;
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

// === Pack animations ===
packEl.onclick = () => {
  if (packEl.classList.contains("opening")) return;
  if (player.balance < 100) {
    alert("Not enough coins!");
    return;
  }
  packEl.classList.add("opening");
  setTimeout(() => {
    packEl.classList.add("hidden");
    openedPack = openPack();
    currentIndex = 0;
    showCard();
    cardViewer.classList.remove("hidden");
  }, 600);
};

function showCard() {
  const card = openedPack[currentIndex];
  cardEl.className = `reveal ${card.rarity}`;
  cardEl.innerHTML = `<strong>${card.name}</strong><br><em>${card.rarity}</em>`;
  balanceEl.textContent = player.balance;
}

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

// === Buttons ===
document.getElementById("buy-pack").onclick = () => {
  alert("Click the pack to open it!");
};

document.getElementById("reset").onclick = () => {
  if (confirm("Reset progress?")) {
    localStorage.removeItem("player");
    player = { balance: 1000, inventory: [] };
    showInventory();
    balanceEl.textContent = player.balance;
  }
};

// === Init ===
showInventory();
balanceEl.textContent = player.balance;
