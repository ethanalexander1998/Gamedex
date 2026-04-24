const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/search?q=elden+ring
router.get('/', async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.json([]);

  const key = process.env.RAWG_API_KEY;
  if (!key) return res.status(500).json({ error: 'RAWG_API_KEY not set in .env' });

  try {
    const { data } = await axios.get('https://api.rawg.io/api/games', {
      params: { key, search: q, page_size: 12, search_precise: true }
    });

    const results = (data.results || []).map(g => ({
      rawgId: g.id,
      title: g.name,
      platform: g.platforms?.map(p => p.platform.name).slice(0, 3).join(', ') || '',
      genre: g.genres?.map(g => g.name).slice(0, 2).join(', ') || '',
      cover: g.background_image || null,
      released: g.released || null,
      rating: g.rating ? Math.round(g.rating * 2 * 10) / 10 : null
    }));

    res.json(results);
  } catch (err) {
    res.status(502).json({ error: 'RAWG request failed', detail: err.message });
  }
});

module.exports = router;
