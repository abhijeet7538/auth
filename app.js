require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
const { log } = require('console');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB');
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.CIGRET, encryptedFields: ['password'] });

const User = new mongoose.model('Usser', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    const saveSucess = await saveuser(newUser);
    if (saveSucess) {
        res.render('secrets');
    } else {
        console.log("error in saving");
    }
    async function saveuser(newUser) {
        try {
            await newUser.save();
            console.log("saved successfully");
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
});

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const founduser = await User.findOne({ email: username })
    try {
        if (founduser) {
            if (founduser.password === password) {
                res.render('secrets');
            } else {
                console.log('icorrect pass');
            }
        } else {
            console.log('user not found');
        }
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, () => {
    console.log("server runnin on port 3000");
})