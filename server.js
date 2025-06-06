const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('.'));
app.use(express.json());

const FILNAMN = 'fiskdata.txt';

app.post('/registrera', (req, res) => {
  const { fiskare, sort, vikt } = req.body;
  const datum = new Date().toLocaleString('sv-SE');
  const rad = `${datum} - ${fiskare} fick ${sort}: ${vikt} kg\n`;

  fs.appendFile(FILNAMN, rad, err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Fel vid sparning.');
    }
    res.send('Fisk registrerad!');
  });
});

// Summerings-API
app.get('/summering', (req, res) => {
  if (!fs.existsSync(FILNAMN)) return res.json({ sorter: {}, fiskare: {} });

  const rader = fs.readFileSync(FILNAMN, 'utf8').split('\n').filter(Boolean);
  const sorter = {};
  const fiskare = {};

  rader.forEach(rad => {
    const match = rad.match(/- (.+) fick (.+): ([\d.]+) kg/);
    if (match) {
      const namn = match[1];
      const sort = match[2];
      const vikt = parseFloat(match[3]);

      sorter[sort] = (sorter[sort] || 0) + vikt;
      fiskare[namn] = (fiskare[namn] || 0) + vikt;
    }
  });

  res.json({ sorter, fiskare });
});

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
