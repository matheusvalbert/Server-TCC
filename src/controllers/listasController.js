const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

router.use(authMiddleware);
router.use(userMiddleware);

router.post('/newList', (req, res) => {

  const name = req.body.name;
  const ids = req.body.ids;

  db.query('INSERT INTO listas (name, ids, number) VALUES (?, ?, ?)',
  [name, ids, req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'insert error' });
    else
      return res.send({ inserted: true });
  });
});

router.get('/get', (req, res) => {
  db.query('SELECT * FROM listas WHERE number = ?',
  [req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'fail to get lists' });
    else
      return res.send({ result: result });
  });
});

router.patch('/modify', (req, res) => {

  const name = req.body.name;
  const ids = req.body.ids;
  const uid = req.body.uid;

  db.query('UPDATE listas SET name = ?, ids = ? WHERE uid = ?',
  [name, ids, uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'fail to modify list' });
    else
      return res.send({ modified: true });
  });
});

router.delete('/delete', (req, res) => {

  const uid = req.body.uid;

  db.query('DELETE FROM listas WHERE uid = ?',
  [uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'fail to delete' });
    else {
      db.query('DELETE FROM reserva_ambientes WHERE lista_uid = ?',
      [uid],
      (error, results) => {
        if(err)
          return res.status(400).send({ error: 'fail to delete' });
      })
      return res.send({ deleted: true });
    }
  });
});

module.exports = app => app.use('/listas', router);
