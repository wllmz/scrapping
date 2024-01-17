const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 5000;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// View Engine
app.set('view engine', 'ejs');

// Route pour la page d'accueil avec formulaire
app.get('/', (req, res) => {
    res.render('index');
});

// Route pour traiter le formulaire
app.post('/scrape', async (req, res) => {
    try {
        const url = req.body.url;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageText = $('html').text();

        // Regex pour détecter des adresses e-mail
        const emailRegex = /[\w.-]+@[\w.-]\w+/g;
        const emails = pageText.match(emailRegex) || [];

        // Éliminer les doublons
        const uniqueEmails = [...new Set(emails)];

        const emailsHtml = uniqueEmails.join('<br>');

        res.send(emailsHtml);
    } catch (error) {
        console.error('Erreur lors du scraping :', error.message);
        res.status(500).send('Erreur lors du scraping de la page');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
