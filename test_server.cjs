const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

app.use(express.json());

app.post('/log-error', (req, res) => {
  console.log('BROWSER ERROR:', req.body);
  fs.writeFileSync('browser_error.log', JSON.stringify(req.body, null, 2) + '\n', {flag: 'a'});
  res.sendStatus(200);
});

app.post('/log', (req, res) => {
  console.log('BROWSER LOG:', req.body);
  fs.writeFileSync('browser_log.log', JSON.stringify(req.body, null, 2) + '\n', {flag: 'a'});
  res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*all', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3001, () => console.log('Test server running on 3001'));
