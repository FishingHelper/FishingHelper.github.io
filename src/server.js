const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init, createPlayer, getPlayer, savePlayer } = require('./store');
const { openPack, calcSellPrice } = require('./game');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

async function ensure() {
  await init();
}
ensure();

app.post('/api/create-player', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const player = await createPlayer(name);
  res.json(player);
});

app.get('/api/player/:id', async (req, res) => {
  const p = await getPlayer(req.params.id);
  if (!p) return res.status(404).json({ error: 'player not found' });
  res.json(p);
});

// Buy a pack (cost defined here)
const PACK_COST = 100;

app.post('/api/player/:id/buy-pack', async (req, res) => {
  const player = await getPlayer(req.params.id);
  if (!player) return res.status(404).json({ error: 'player not found' });
  if (player.balance < PACK_COST) return res.status(400).json({ error: 'insufficient funds' });

  player.balance -= PACK_COST;
  const opened = openPack();
  // add to inventory
  for (const c of opened) {
    player.inventory[c.instanceId] = c;
  }
  await savePlayer(player.id, player);
  res.json({ opened, balance: player.balance });
});

// Sell a card instance
app.post('/api/player/:id/sell', async (req, res) => {
  const { instanceId } = req.body;
  const player = await getPlayer(req.params.id);
  if (!player) return res.status(404).json({ error: 'player not found' });
  if (!player.inventory[instanceId]) return res.status(400).json({ error: 'card not found' });

  const card = player.inventory[instanceId];
  const sellPrice = calcSellPrice(card);
  player.balance += sellPrice;
  delete player.inventory[instanceId];
  await savePlayer(player.id, player);
  res.json({ sold: card, price: sellPrice, balance: player.balance });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
