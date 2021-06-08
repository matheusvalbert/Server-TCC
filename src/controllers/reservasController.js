const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

router.use(authMiddleware);
router.use(userMiddleware);

router.post('/addLocal', (req, res) => {

  if(req.userId !== 1)
    return res.status(400).send({ insertedAmbiente: 'not authorized' });

  const name = req.body.name;

  db.query('INSERT INTO ambientes (name) VALUES (?)',
  [name],
  (err, result) => {
    if(err)
      return res.status(400).send({ insertedAmbiente: false });
    else
      return res.send({ insertedAmbiente: true });
  });
});

router.delete('/deleteLocal', (req, res) => {

  if(req.userId !== 1)
    return res.status(400).send({ deletedAmbiente: 'not authorized' });

  const name = req.body.name;

  db.query('DELETE FROM ambientes WHERE name = ?',
  [name],
  (err, result) => {
    if(err)
      return res.status(400).send({ deleteLocal: false });
    else
      return res.send({ deleteLocal: true });
  });
});

router.get('/getLocal', (req, res) => {

  db.query('SELECT * FROM ambientes',
  [],
  (err, result) => {
    if(err)
      return res.status(400).send({ getLocal: false });
    else {

      let names = [];
      let id = [];

      for(var i = 0; i < result.length; i++) {
        names.push(result[i].name);
        id.push(result[i].uid);
      }

      const results = { names, id };

      return res.send({ result: results });
    }
  });
});

router.get('/getAmbientes', (req, res) => {

  db.query('SELECT * FROM ambientes',
  [],
  (err, result) => {
    if(err)
      return res.status(400).send({ getAmbientes: false });
    else
      return res.send({ result: result });
  });
});

module.exports = app => app.use('/reservas', router);
