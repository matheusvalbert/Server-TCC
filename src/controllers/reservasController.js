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

router.post('/addReservaAmbiente', (req, res) => {

  const ambiente_uid = req.body.ambiente_uid;
  const lista_uid = req.body.lista_uid;
  const date = req.body.date;

  db.query('INSERT INTO reserva_ambientes (number, ambiente_uid, lista_uid, date) VALUES (?, ?, ?, ?)',
  [req.number, ambiente_uid, lista_uid, date],
  (err, result) => {
    if(err)
      return res.status(400).send({ addReservaAmbiente: err });
    else
      return res.send({ addReservaAmbiente: true });
  });

});

router.get('/getReservaAmbiente', (req, res) => {

  const ambiente_uid = req.query.ambiente_uid;

  db.query('SELECT * FROM reserva_ambientes WHERE ambiente_uid = ?',
  [ambiente_uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ getReservaAmbiente: false });
    else
      return res.send({ result: result, number: req.number });
  });
});

router.delete('/deleteReservaAmbiente', (req, res) => {

  const date = req.body.date;

  db.query('DELETE FROM reserva_ambientes WHERE date = ? AND number = ?',
  [date, req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ deleteReservaAmbiente: false });
    else
      return res.send({ deleteReservaAmbiente: true });
  }
  );
});

router.patch('/updateReservaAmbiente', (req, res) => {

  const lista_uid = req.body.lista_uid;
  const date = req.body.date;

  console.log(lista_uid, date);

  db.query('UPDATE reserva_ambientes SET lista_uid = ? WHERE date = ? AND number = ?',
  [lista_uid, date, req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ updateReservaAmbiente: false });
    else
      res.send({ updateReservaAmbiente: true });
  });

});

module.exports = app => app.use('/reservas', router);
