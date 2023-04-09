const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

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
  console.log('req.body', req.body);
  fs.writeFile('./db/db.json', JSON.stringify(req.body), (err) => {
    if (err) throw err;
    console.log('req.body', req.body);
  });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Listening at http://localhost:${PORT}`)
);
