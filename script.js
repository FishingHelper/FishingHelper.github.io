document.addEventListener("DOMContentLoaded", () => {

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

  let player = JSON.parse(localStorage.getItem("player")) || { balance: 1000, inventory: [] };
  let packAvailable = false;
  let openedPack = [];
  let currentIndex = 0;

  const balanceEl = document.getElementById("balance");
  const invList = document.getElementById("inventory-list");
  const packEl = document.getElementById("pack");
  const cardViewer = document.getElementById("card-viewer");
  const cardEl = document.getElementById("card");
  const nextBtn = document.getElementById("next-card");
  const buyPackBtn = document.getElementById("buy-pack");
  const resetBtn = document.getElementById("reset");

  function save() {
    localStorage.setItem("player", JSON.stringify(player));
  }

  function weightedPick(dist) {
    const r = Math.random();
    let acc = 0;
    for (const d of dist) {
      acc += d.chance;
      if (r <= acc) return d.rarity;
    }
    return dist[dist.length - 1].rarity;
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

  functi
