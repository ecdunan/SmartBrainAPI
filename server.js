const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

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

/* db placeholder */
const database = {
    users: [{
            id: '1',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }]
}

app.use(bodyParser.json());
app.use(cors());


const getUser = id =>{
    const users = database.users;

    for(let i =0; i< users.length; i++) {
        if(users[i].id === id) {
            return users[i];
        }
    }

    return null;
}

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
     if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(404).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    db('users')
        .returning('*')
        .insert({
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
        })
        .then(user => res.json(user[0]))
        .catch(err => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    db('users')
        .select('*')
        .where({id})
        .then(user => {
            if(user.length > 0) {
                res.json(user[0])
            } else {
                res.status('400').json('user not found')
            }
        })
        .catch(err => res.status('400').send(err));
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    const user = getUser(id);

    if(user) {
        user.entries++;
        res.json(user.entries);
    } else {
        res.status('404').json('userid does not exist.');
    }
})

app.listen(3000, () => {
    console.log('App started on port 3000');
});