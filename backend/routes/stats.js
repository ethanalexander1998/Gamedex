const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const games = await Game.find({});
    const total = games.length;

    const completed = games.filter(g => g.status === 'Completed');
    const rated = completed.filter(g => g.score != null);
    const avgScore = rated.length > 0
      ? Math.round((rated.reduce((sum, g) => sum + g.score, 0) / rated.length) * 10) / 10
      : null;

    const byStatus = {};
    for (const g of games) {
      byStatus[g.status] = (byStatus[g.status] || 0) + 1;
    }

    const platformMap = {};
    for (const g of games) {
      if (g.platform) platformMap[g.platform] = (platformMap[g.platform] || 0) + 1;
    }

    const genreMap = {};
    for (const g of games) {
      if (g.genre) genreMap[g.genre] = (genreMap[g.genre] || 0) + 1;
    }

    res.json({
      total,
      completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0,
      avgScore,
      byStatus,
      byPlatform: Object.entries(platformMap).sort((a, b) => b[1] - a[1]).slice(0, 8),
      byGenre: Object.entries(genreMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
