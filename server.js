const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/messages', (req, res) => {
  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Erreur serveur');
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) return res.status(400).send('Champs manquants');

  fs.readFile('messages.json', 'utf8', (err, data) => {
    const messages = err ? [] : JSON.parse(data);
    messages.unshift({ name, message });
    fs.writeFile('messages.json', JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).send('Erreur écriture');
      res.json({ status: 'ok' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
