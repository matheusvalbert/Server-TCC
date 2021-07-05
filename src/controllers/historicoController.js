const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

router.use(authMiddleware);
router.use(userMiddleware);

router.get('/getHistorico', (req, res) => {
  if(req.userId !== 1)
    return res.status(400).send({ insertedAmbiente: 'not authorized' });

  db.query('SELECT * FROM history ORDER BY uid desc',
  [],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      const name = [];
      const date = [];
      const number = [];
      const type = [];

      result.forEach(result => {
        name.push(result.name);
        date.push(result.date);
        number.push(result.number);
        type.push(result.type);
      });

      return res.send({ name: name, date: date, number: number, type: type });
    }
  });
});

module.exports = app => app.use('/historico', router);
