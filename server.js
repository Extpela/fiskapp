
const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const FormData = require('form-data');
const path = require('path');
const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const STORAGE_BUCKET = 'bilder';
const TABLE = 'registreringar';

app.use(express.static('public'));
app.use(express.json());

// Hämta registreringar
app.get('/data', async (req, res) => {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?select=*`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  const data = await result.json();
  res.json(data);
});

// Registrera ny post
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

// Bilduppladdning till Supabase Storage
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const filename = file.originalname;

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${filename}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': file.mimetype,
      'Content-Length': file.size
    },
    body: file.buffer
  });

  if (uploadRes.ok) {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
    res.json({ url: publicUrl });
  } else {
    res.status(500).json({ error: 'Uppladdning misslyckades' });
  }
});

// Radera post via ID
app.delete('/radera/:id', async (req, res) => {
  const id = req.params.id;
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal'
    }
  });

  if (result.ok) {
    res.json({ status: 'deleted' });
  } else {
    res.status(500).json({ error: 'Kunde inte radera' });
  }
});

app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});
