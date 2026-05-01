const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recommendation = require('../models/Recommendation');
const Game = require('../models/Game');

// GET /api/recommendations — all non-dismissed
router.get('/', async (req, res) => {
  try {
    const recs = await Recommendation.find({ dismissed: false }).sort({ createdAt: -1 });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/recommendations/generate — auto-generate from top-rated library games
router.post('/generate', async (req, res) => {
  try {
    const key = process.env.RAWG_API_KEY;

    // Get library games that have a genre, sorted by score desc
    const games = await Game.find({ genre: { $exists: true, $ne: '' } })
      .sort({ score: -1 })
      .limit(5);

    if (games.length === 0) return res.json([]);

    // Collect existing library titles (lowercase) to avoid recommending duplicates
    const allGames = await Game.find({}, 'title');
    const libraryTitles = new Set(allGames.map(g => g.title.toLowerCase()));

    const saved = [];
    const seenRawgIds = new Set();

    for (const game of games) {
      const primaryGenre = game.genre.split(',')[0].trim();
      const { data } = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key,
          genres: primaryGenre.toLowerCase(),
          ordering: '-rating',
          page_size: 6,
          exclude_collection: 1
        }
      });

      for (const g of (data.results || [])) {
        if (libraryTitles.has(g.name.toLowerCase())) continue;
        if (seenRawgIds.has(g.id)) continue;
        seenRawgIds.add(g.id);

        try {
          const rec = await Recommendation.findOneAndUpdate(
            { rawgId: g.id },
            {
              basedOn: game._id,
              basedOnTitle: game.title,
              rawgId: g.id,
              title: g.name,
              genre: g.genres?.map(x => x.name).slice(0, 2).join(', ') || '',
              platform: g.platforms?.map(x => x.platform.name).slice(0, 2).join(', ') || '',
              cover: g.background_image || null,
              reason: `Similar to ${game.title}${game.score ? ` (${game.score}/10)` : ''}`,
              dismissed: false
            },
            { upsert: true, new: true }
          );
          saved.push(rec);
        } catch (e) {
          // skip
        }
      }
      await new Promise(r => setTimeout(r, 200));
    }

    res.json(saved);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// PUT /api/recommendations/:id/dismiss
router.put('/:id/dismiss', async (req, res) => {
  try {
    const rec = await Recommendation.findByIdAndUpdate(req.params.id, { dismissed: true }, { new: true });
    if (!rec) return res.status(404).json({ error: 'Not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/recommendations/:id
router.delete('/:id', async (req, res) => {
  try {
    await Recommendation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
