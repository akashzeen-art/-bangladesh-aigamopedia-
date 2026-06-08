const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5500;
const root = __dirname;

function sendHtml(file) {
  return (req, res) => res.sendFile(path.join(root, file));
}

function localeRouter() {
  const r = express.Router();
  r.get('/', sendHtml('index.html'));
  r.get('/index.html', sendHtml('index.html'));
  r.get('/moreGames.html', sendHtml('moreGames.html'));
  r.get('/myAccount.html', sendHtml('myAccount.html'));
  r.get('/termsAndConditions.html', sendHtml('termsAndConditions.html'));
  r.use(express.static(root));
  return r;
}

// Root → redirect to /bn
app.get('/', (req, res) => res.redirect(302, '/bn/'));

// /bn and /en routes
for (const lang of ['bn', 'en']) {
  app.get('/' + lang, sendHtml('index.html'));
  app.get('/' + lang + '/', sendHtml('index.html'));
  app.use('/' + lang, localeRouter());
}

app.use('/', express.static(root));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AiGameopedia running on port ${PORT}`);
  console.log(`  Bangla:  http://localhost:${PORT}/bn`);
  console.log(`  English: http://localhost:${PORT}/en`);
});
