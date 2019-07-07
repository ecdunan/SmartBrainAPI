const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

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

app.get('/', (req, res) => {
    res.json('ok');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    db('login')
        .select('hash')
        .where('email', '=', email)
        .then(user => {
            const isValid = bcrypt.compareSync(password, user[0].hash);

            if(isValid) {
                return db.select('*')
                    .from('users')
                    .where('email', '=', email)
                    .then(result => {
                        const user = result[0];

                        if(user.id) {
                            res.json(user);
                        } else {
                            res.status.json('error finding user')
                        }
                    })
                    .catch(err => res.status.json('error finding user'))
            } else {
               res.status(400).json('password is incorrect.')
            }
        }).catch(err => res.status(400).json('email does not exist.'));
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0],
                    entries: 0,
                    joined: new Date()
                })
                .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
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
        .catch(err => res.status('400').json('error encountered'));
});

app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('*')
    .then(user => {
        if(user.length > 0) {
            res.json(user[0].entries)
        } else {
            res.status('400').json('user not found')
        }
    })
    .catch(err => res.status('400').json('error encoutnered'));
})

app.listen(3000, () => {
    console.log('App started on port 3000');
});