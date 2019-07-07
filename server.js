const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'emman',
        password: 'root',
        database: 'smartbrain'
    }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.json('ok'));
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));

app.listen(3000, () => {
    console.log('App started on port 3000');
});