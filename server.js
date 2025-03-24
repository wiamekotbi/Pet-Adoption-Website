const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'your_secret_key', // Change this to something more secure
    resave: false,
    saveUninitialized: false
}));

// Paths to data files
const usersFilePath = path.join(__dirname, 'data', 'users.txt');
const petsFilePath = path.join(__dirname, 'data', 'pets.txt');

// Routes
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/catcare', (req, res) => {
    res.render('catcare');
});

app.get('/dogcare', (req, res) => {
    res.render('dogcare');
});

app.get('/away', (req, res) => {
    res.render('away');
});

app.get('/contactus', (req, res) => {
    res.render('contactus');
});

app.get('/find', (req, res) => {
    res.render('find');
});

app.get('/pets', (req, res) => {
    res.render('pets');
});

app.get('/privacy', (req, res) => {
    res.render('privacy');
});

// User registration and login routes
function verifyUser(username) {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.trim().split('\n');
    return users.some(user => {
        const [storedUsername] = user.split(':');
        return storedUsername === username;
    });
}

function registerUser(username, password) {
    const newUser = `${username}:${password}\n`;
    fs.appendFileSync(usersFilePath, newUser, 'utf8');
}

// Login route
app.get('/login', (req, res) => {
    res.render('login'); // Render login.ejs
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (verifyUser(username)) {
        req.session.username = username;
        res.redirect('/away');
    } else {
        res.send('Login failed. Please try again.');
    }
});

// Register route
app.get('/register', (req, res) => {
    res.render('register'); // Render register.ejs
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (verifyUser(username)) {
        res.send('Username already exists, please choose another one.');
    } else {
        registerUser(username, password);
        res.send('Account created successfully. You can now login.');
    }
});

// Pet registration
function getNextPetId() {
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const lastId = petsData.trim().split('\n').reduce((maxId, line) => {
        const id = parseInt(line.split(':')[0]);
        return id > maxId ? id : maxId;
    }, 0);
    return lastId + 1;
}

app.get('/give-away', (req, res) => {
    if (req.session.username) {
        res.render('give-away'); // Render the pet registration form
    } else {
        res.redirect('/login');
    }
});

app.post('/give-away', (req, res) => {
    if (req.session.username) {
        const petData = req.body;
        const petId = getNextPetId();
        const petRecord = `${petId}:${req.session.username}:${Object.values(petData).join(':')}\n`;

        fs.appendFileSync(petsFilePath, petRecord, 'utf8');
        res.send('Pet registered successfully.');
    } else {
        res.redirect('/login');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
