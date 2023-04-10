const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const path = require('path');

const app = express();

const PORT = 3001;


app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  let db = [];
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    db = JSON.parse(data); 
    req.body.id = uuidv4();
    db.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
      if (err) throw err;
    });
  });
  res.send(req.body);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  const filteredNotes = notes.filter(note => note.id !== id);
  fs.writeFileSync('./db/db.json', JSON.stringify(filteredNotes));
  res.send(filteredNotes);
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);
