const Clarifai = require('clarifai');
const app = new Clarifai.App({
 apiKey: 'ce2e19410fea4a48b8d521989ea8963b'
});

const handleAPICall = (req, res) => {
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        req.body.input)
      .then(data => {
        res.json(data);
      })
      .catch(error => res.status(400).json(error));
}

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
    handleImage,
    handleAPICall
}