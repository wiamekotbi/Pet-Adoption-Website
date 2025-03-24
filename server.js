const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('main'); 
});

app.get('/catcare', (req, res) => {
    res.render('catcare'); // Renders catcare.ejs
});

app.get('/dogcare', (req, res) => {
    res.render('dogcare'); // Renders dogcare.ejs
});

app.get('/away', (req, res) => {
    res.render('away'); // Renders dogcare.ejs
});

app.get('/contactus', (req, res) => {
    res.render('contactus'); // Renders dogcare.ejs
});

app.get('/find', (req, res) => {
    res.render('find'); // Renders dogcare.ejs
});

app.get('/pets', (req, res) => {
    res.render('pets'); // Renders dogcare.ejs
});

app.get('/privacy', (req, res) => {
    res.render('privacy'); // Renders dogcare.ejs
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
