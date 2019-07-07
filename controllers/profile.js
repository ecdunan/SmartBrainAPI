const handleProfile = (db) => (req, res) => {
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
};

module.exports = {
    handleProfile
}