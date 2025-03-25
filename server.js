const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Basic setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// File paths
const dataDir = path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.txt');
const petsFilePath = path.join(dataDir, 'pets.txt');

// Create data directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Helper functions
function verifyUser(username) {
    if (!fs.existsSync(usersFilePath)) return false;
    
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

function getNextPetId() {
    if (!fs.existsSync(petsFilePath)) return 1;
    
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const lines = petsData.trim().split('\n');
    return lines.reduce((maxId, line) => {
        const id = parseInt(line.split(':')[0]) || 0;
        return id > maxId ? id : maxId;
    }, 0) + 1;
}

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/dog-care', (req, res) => res.render('dog-care', { title: 'Dog Care' }));
app.get('/cat-care', (req, res) => res.render('cat-care', { title: 'Cat Care' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact Us' }));
app.get('/find-pet', (req, res) => res.render('find-pet', { title: 'Find a Pet', pets: undefined }));

// Account routes
app.get('/register', (req, res) => res.render('register', { title: 'Create Account' }));

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (verifyUser(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }
    
    registerUser(username, password);
    res.json({ message: "Account created successfully" });
});

// Login routes
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (verifyUser(username)) {
        req.session.username = username;
        return res.redirect('/give-away');
    }
    
    res.send('Login failed');
});

// Pet routes
app.get('/give-away', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    res.render('give-away', { title: 'Give Away Pet' });
});

app.post('/give-away', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }

    const petId = getNextPetId();
    const petRecord = `${petId}:${req.session.username}:${Object.values(req.body).join(':')}\n`;
    fs.appendFileSync(petsFilePath, petRecord);
    res.send('Pet registered successfully');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});