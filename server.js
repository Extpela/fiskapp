const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// HÄR: Fyll i din egen Supabase-info
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TABLE = 'registreringar';

app.use(express.static('public'));
app.use(express.json());

// GET: Hämta alla registreringar
app.get('/data', async (req, res) => {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const data = await result.json();
  res.json(data);
});

// POST: Lägg till ny registrering
app.post('/registrera', async (req, res) => {
  const post = req.body;
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify([post])
  });
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
