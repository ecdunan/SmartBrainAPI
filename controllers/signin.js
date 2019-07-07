const handleSignin = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        res.status(400).json('email and password could not be blank.');
    } else {
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
                            res.status(400).json('error finding user')
                        }
                    })
                    .catch(err => res.status(400).json('error finding user'))
            } else {
               res.status(400).json('password is incorrect.')
            }
        }).catch(err => res.status(400).json('email does not exist.'))
    }
};

module.exports = {
    handleSignin
};