const express = require('express')
const router = express.Router();
const Game = require('../models/Game')

router.get('/', async (req, res) => {
    try{
        const games = await Game.find({});
        const html = gamelistExport(games)
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', 'attachment; filename="my-games.html"');

        res.send(html);
    }

    catch (err) {
        console.error(err);
        res.status(500).send("Error making game list");
    }
}
);

function gamelistExport(games) {
  const gameCards = games.map(g => {
    return `
      <div class="game">
        ${
          g.cover
            ? `<img src="${g.cover}" alt="cover">`
            : `<div class="placeholder"></div>`
        }

        <div class="info">
          <h2>${g.title}</h2>
          <p>${g.platform || ''}</p>
          <p>Score: ${g.score ?? 'N/A'}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <title>My Games</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #111;
      color: white;
      padding: 20px;
    }

    h1 {
      text-align: center;
    }

    .game {
      display: flex;
      align-items: center;
      gap: 15px;
      background: #222;
      padding: 15px;
      margin: 10px auto;
      max-width: 600px;
      border-radius: 10px;
    }

    img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }

    .placeholder {
      width: 80px;
      height: 80px;
      background: #333;
      border-radius: 8px;
    }

    .info h2 {
      margin: 0;
      font-size: 18px;
    }

    .info p {
      margin: 5px 0;
      color: #ccc;
    }
  </style>
</head>

<body>
  <h1>My Game Library</h1>

  ${gameCards}

</body>
</html>
  `;
}
module.exports = router;