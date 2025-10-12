const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const cards = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'cards.json')));

// rarity distribution for a single pack (5 cards per pack example)
const PACK_CONFIG = {
  packSize: 5,
  distribution: [
    {rarity: 'common', chance: 0.75},
    {rarity: 'rare', chance: 0.20},
    {rarity: 'epic', chance: 0.04},
    {rarity: 'legendary', chance: 0.01}
  ]
};

function weightedPick(rarityDist) {
  const r = Math.random();
  let acc = 0;
  for (const item of rarityDist) {
    acc += item.chance;
    if (r <= acc) return item.rarity;
  }
  // fallback
  return rarityDist[rarityDist.length-1].rarity;
}

function randomCardByRarity(rarity) {
  const pool = cards.filter(c => c.rarity === rarity);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function openPack() {
  const out = [];
  for (let i = 0; i < PACK_CONFIG.packSize; i++) {
    const rarity = weightedPick(PACK_CONFIG.distribution);
    const card = randomCardByRarity(rarity);
    if (!card) continue;
    // create unique instance id so same card can be sold separately
    out.push({
      instanceId: nanoid(),
      cardId: card.id,
      name: card.name,
      rarity: card.rarity,
      basePrice: card.basePrice
    });
  }
  return out;
}

// price formula: market modifiers could be applied later; for now rarity multiplier + random variance
const RARITY_MULT = {
  common: 1,
  rare: 1.5,
  epic: 3,
  legendary: 8
};

function calcSellPrice(cardInstance, playerSkill = 1.0) {
  // playerSkill can represent luck/market skill; default 1
  const base = cardInstance.basePrice || 1;
  const mult = RARITY_MULT[cardInstance.rarity] || 1;
  // value jitter +-10%
  const jitter = 0.9 + Math.random() * 0.2;
  return Math.max(1, Math.round(base * mult * jitter * playerSkill));
}

module.exports = { openPack, calcSellPrice };
