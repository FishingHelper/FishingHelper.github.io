let player = null;

async function api(path, opts = {}) {
  const res = await fetch('/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...(opts.body ? { body: JSON.stringify(opts.body) } : {}),
    method: opts.method || 'GET'
  });
  return res.json();
}

document.getElementById('create').onclick = async () => {
  const name = document.getElementById('name').value || 'Player';
  const p = await api('/create-player', { method: 'POST', body: { name }});
  player = p;
  showPlayer();
};

function showPlayer() {
  if (!player) return;
  document.getElementById('playerArea').style.display = 'block';
  document.getElementById('playerName').innerText = `${player.name} (${player.id})`;
  document.getElementById('balance').innerText = player.balance;
  renderInventory();
}

async function refreshPlayer() {
  if (!player) return;
  player = await api(`/player/${player.id}`);
  showPlayer();
}

document.getElementById('buyPack').onclick = async () => {
  const res = await api(`/player/${player.id}/buy-pack`, { method: 'POST' });
  if (res.error) return alert(res.error);
  document.getElementById('lastPack').innerText = JSON.stringify(res.opened, null, 2);
  player.balance = res.balance;
  // fetch whole player to get inventory
  await refreshPlayer();
};

function renderInventory() {
  const inv = document.getElementById('inventory');
  inv.innerHTML = '';
  if (!player || !player.inventory) return;
  const ids = Object.keys(player.inventory);
  if (ids.length === 0) inv.innerText = 'Empty';
  ids.forEach(id => {
    const c = player.inventory[id];
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<strong>${c.name}</strong> — ${c.rarity} — id: ${id}
      <br><button data-id="${id}">Sell</button>`;
    div.querySelector('button').onclick = async () => {
      const r = await api(`/player/${player.id}/sell`, { method: 'POST', body: { instanceId: id }});
      if (r.error) return alert(r.error);
      player.balance = r.balance;
      await refreshPlayer();
      document.getElementById('lastPack').innerText = `Sold ${r.sold.name} for ${r.price}`;
    };
    inv.appendChild(div);
  });
}

window.onload = () => {
  // nothing yet
};
