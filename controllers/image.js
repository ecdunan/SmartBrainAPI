const handleImage = (db) => (req, res) => {
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
};

module.exports = {
    handleImage
}