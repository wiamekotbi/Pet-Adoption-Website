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

function searchPets(criteria) {
    const { type, breed, age, gender, otherdogs, othercats, smallchildren } = criteria;
    const petsData = fs.readFileSync(petsFilePath, 'utf8');
    const pets = petsData.trim().split('\n').map(line => {
        const parts = line.split(':');
        return {
            id: parts[0],
            username: parts[1],
            type: parts[2],
            breed: parts[3],
            age: parts[4],
            gender: parts[5],
            getsAlongWithOtherDogs: parts[6] === "yes",
            getsAlongWithCats: parts[7] === "yes",
            getsAlongWithChildren: parts[8] === "yes",
            description: parts[9],
            ownerFirstName: parts[10],
            ownerLastName: parts[11],
            ownerEmail: parts[12]
        };
    });

    return pets.filter(pet => {
        const breedMatch = breed === "Doesn't matter" || pet.breed.toLowerCase().includes(breed.toLowerCase());
        const ageMatch = age === "Doesn't matter" || pet.age === age;
        const genderMatch = gender === "Doesn't matter" || pet.gender.toLowerCase() === gender.toLowerCase();
        const dogsMatch = !otherdogs || pet.getsAlongWithOtherDogs;
        const catsMatch = !othercats || pet.getsAlongWithCats;
        const childrenMatch = !smallchildren || pet.getsAlongWithChildren;

        return pet.type.toLowerCase() === type.toLowerCase() && breedMatch && ageMatch && genderMatch && dogsMatch && catsMatch && childrenMatch;
    });
}

// Routes
app.get('/', (req, res) => res.render('main', { title: 'Home' }));
app.get('/dogcare', (req, res) => res.render('dogcare', { title: 'Dog Care' }));
app.get('/catcare', (req, res) => res.render('catcare', { title: 'Cat Care' }));
app.get('/contactus', (req, res) => res.render('contactus', { title: 'Contact Us' }));
app.get('/find', (req, res) => res.render('find', { title: 'Find a Pet', pets: undefined }));
app.get('/pets', (req, res) => res.render('pets', { title: 'Pets' }));
app.get('/privacy', (req, res) => res.render('privacy', { title: 'Privacy' }));

// Register routes
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

    if (!fs.existsSync(usersFilePath)) {
        return res.status(401).json({ 
            success: false,
            message: "No account was found" 
        });
    }

    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.trim().split('\n');
    
    const userFound = users.find(user => {
        const [storedUsername, storedPassword] = user.split(':');
        return storedUsername === username && storedPassword === password;
    });

    if (userFound) {
        req.session.username = username;
        return res.json({ 
            success: true,
            redirect: '/away'  
        });
    } else {
        return res.status(401).json({ 
            success: false,
            message: "Invalid username or password" 
        });
    }
});

// Pet routes
app.get('/away', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    res.render('away', { title: 'Give Away Pet' });
});

app.post('/away', (req, res) => {
    if (req.session.username) {
        const { 
            type, 
            breed, 
            age, 
            gender, 
            otherdogs, 
            othercats, 
            smallchildren, 
            description, 
            ownerFirstName, 
            ownerLastName, 
            ownerEmail 
        } = req.body;

        const petId = getNextPetId();
        const petRecord = `${petId}:${req.session.username}:${type}:${breed}:${age}:${gender}:${otherdogs ? 'yes' : 'no'}:${othercats ? 'yes' : 'no'}:${smallchildren ? 'yes' : 'no'}:${description}:${ownerFirstName}:${ownerLastName}:${ownerEmail}\n`;

        try {
            fs.appendFileSync(petsFilePath, petRecord, 'utf8');
            res.status(200).send('Pet registered successfully !');
        } catch (error) {
            console.error('Error writing to pets file:', error);
            res.status(500).send('Error registering pet.');
        }
    } else {
        res.status(401).redirect('/login');
    }
});


// Find Pet routes
app.get('/find', (req, res) => {
    res.render('find', { title: 'Find a Pet', pets: undefined });
});

app.post('/find', (req, res) => {
    try {
        const results = searchPets(req.body);
        res.render('find', { title: 'Find a Pet', pets: results });
    } catch (error) {
        console.error('Error searching pets:', error);
        res.status(500).send('Error searching for pets');
    }
});

//Log out
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send("Error logging out");
            return;
        }
        // Combine title and message into one object
        res.render('logout', { title: 'Logout', message: "You have been successfully logged out." });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
