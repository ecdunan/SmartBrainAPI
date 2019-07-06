const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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

const getUser = id =>{
    const users = database.users;

    for(let i =0; i< users.length; i++) {
        if(users[i].id === id) {
            return users[i];
        }
    }

    return null;
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', (req, res) => {
     if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success');
    } else {
        res.status(404).json('error logging in');
    }
});

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    const newUser = {id: '3',
                    name: name,
                    email: email,
                    password: password,
                    entries: 0,
                    joined: new Date()};

    if(database.users.push(newUser)) {
        res.json(newUser);
    } else {
        res.status('404').json('error creating user');
    }
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = getUser(id);

    if(user) {
        res.json(user);
    } else {
        res.status('404').json('userid does not exist.');
    }
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