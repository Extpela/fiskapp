const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const dataFile = path.join(__dirname, 'fiskdata.json');

function loadData() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

app.post('/registrera', (req, res) => {
  const data = loadData();
  data.push(req.body);
  saveData(data);
  res.sendStatus(200);
});

app.get('/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
