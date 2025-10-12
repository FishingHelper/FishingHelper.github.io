// === Game Data ===
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

// === Player State ===
let player = JSON.parse(localStorage.getItem("player")) || {
  name: "Guest",
  balance: 1000,
  inventory: []
};

// === Utility Functions ===
function save() {
  localStorage.setItem("player", JSON.stringify(player));
}

function weightedPick(dist) {
  const r = Math.random();
  let sum = 0;
  for (const d of dist) {
    sum += d.chance;
    if (r <= sum) return d.rarity;
  }
  return "common";
}

function openPack() {
  const pack = [];
  for (let i = 0; i < 5; i++) {
    const rarity = weightedPick(RARITY_DISTRIBUTION);
    const pool = CARDS.filter(c => c.rarity === rarity);
    const card = { ...pool[Math.floor(Math.random() * pool.length)] };
    card.id = Date.now() + "-" + Math.random();
    pack.push(card);
    player.inventory.push(card);
  }
  player.balance -= 100;
  save();
  return pack;
}

function sellCard(id) {
  const idx = player.inventory.findIndex(c => c.id === id);
  if (idx === -1) return;
  const card = player.inventory[idx];
  const rarityMult = { common: 1, rare: 1.5, epic: 3, legendary: 8 };
  const price = Math.round(card.basePrice * (rarityMult[card.rarity] || 1) * (0.9 + Math.random() * 0.2));
  player.balance += price;
  player.inventory.splice(idx, 1);
  save();
  render();
  alert(`Sold ${card.name} for ${price}!`);
}

// === Rendering ===
function render() {
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("balance").textContent = player.balance;

  const inv = document.getElementById("inventory-list");
  inv.innerHTML = "";
  if (player.inventory.length === 0) {
    inv.innerHTML = "<p>(empty)</p>";
  } else {
    player.inventory.forEach(card => {
      const div = document.createElement("div");
      div.className = "card " + card.rarity;
      div.innerHTML = `
        <strong>${card.name}</strong><br>
        <em>${card.rarity}</em><br>
        <button>Sell</button>
      `;
      div.querySelector("button").onclick = () => sellCard(card.id);
      inv.appendChild(div);
    });
  }
}

function showPack(pack) {
  const area = document.getElementById("pack-cards");
  area.innerHTML = "";
  pack.forEach(card => {
    const div = document.createElement("div");
    div.className = "card " + card.rarity;
    div.innerHTML = `<strong>${card.name}</strong><br><em>${card.rarity}</em>`;
    area.appendChild(div);
  });
}

// === Event Handlers ===
document.getElementById("buy-pack").onclick = () => {
  if (player.balance < 100) {
    alert("Not enough coins!");
    return;
  }
  const pack = openPack();
  render();
  showPack(pack);
};

document.getElementById("reset").onclick = () => {
  if (confirm("Reset your progress?")) {
    localStorage.removeItem("player");
    player = { name: "Guest", balance: 1000, inventory: [] };
    render();
  }
};

// === Init ===
render();
