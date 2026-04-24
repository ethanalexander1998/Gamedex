require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Game = require('./models/Game');

const RAWG_KEY = process.env.RAWG_API_KEY;

const entries = [
  { query: 'The Legend of Zelda Breath of the Wild', status: 'Completed', score: 9.8, notes: 'One of the best open world games ever made.' },
  { query: 'Elden Ring', status: 'Playing', score: null, notes: 'Currently stuck on Malenia.' },
  { query: 'Hollow Knight', status: 'Completed', score: 9.5 },
  { query: 'Cyberpunk 2077', status: 'Dropped', score: 6.0, notes: 'Too many bugs at launch.' },
  { query: 'Hades', status: 'Completed', score: 9.3 },
  { query: "Baldur's Gate 3", status: 'Playing', score: null },
  { query: 'God of War Ragnarok', status: 'Plan to Play' },
  { query: 'Stardew Valley', status: 'Completed', score: 8.5 },
  { query: 'Red Dead Redemption 2', status: 'Plan to Play' },
  { query: 'Disco Elysium', status: 'Completed', score: 9.0, notes: 'Incredible writing.' }
];

async function fetchRawg(query) {
  const { data } = await axios.get('https://api.rawg.io/api/games', {
    params: { key: RAWG_KEY, search: query, page_size: 1, search_precise: true }
  });
  const g = data.results?.[0];
  if (!g) return null;
  return {
    title: g.name,
    platform: g.platforms?.map(p => p.platform.name).slice(0, 2).join(', ') || '',
    genre: g.genres?.map(g => g.name).slice(0, 2).join(', ') || '',
    cover: g.background_image || null
  };
}

async function seed() {
  if (!RAWG_KEY) { console.error('RAWG_API_KEY not set in .env'); process.exit(1); }

  await mongoose.connect(process.env.MONGO_URI);
  await Game.deleteMany({});

  const games = [];
  for (const entry of entries) {
    process.stdout.write(`Fetching: ${entry.query}... `);
    const rawg = await fetchRawg(entry.query);
    if (rawg) {
      games.push({ ...rawg, status: entry.status, score: entry.score ?? null, notes: entry.notes ?? '' });
      console.log(`✓ ${rawg.title}`);
    } else {
      console.log('not found, skipping');
    }
    await new Promise(r => setTimeout(r, 250));
  }

  await Game.insertMany(games);
  console.log(`\nSeeded ${games.length} games with RAWG data.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
