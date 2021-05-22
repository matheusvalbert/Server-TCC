const db = require('../database/mysql');

module.exports = (req, res, next) => {

  const uid = req.userId;

  db.query('SELECT number FROM users WHERE uid = ?',
  [uid],
  (err, result) => {
    if (err)
      return res.status(401).send({ error: 'Invalid number' });
    else {
      req.number = result[0].number;
      return next();
    }
  });
}
