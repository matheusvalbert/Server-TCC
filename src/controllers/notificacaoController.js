const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  var hh = String(today.getHours()).padStart(2, '0');
  var min = String(today.getMinutes()).padStart(2, '0');
  today = dd + '/' + mm + '/' + yyyy + '-' + hh + ':' + min;
  return today;
}

router.post('/newNotification', (req, res) => {

    const number = req.body.number;
    const type = req.body.type;
    const notification = req.body.notification;

    db.query('INSERT INTO notificacao (number, type, notification, visitor) VALUES (?, ?, ?, ?)',
    [number, type, notification, null],
    (err, result) => {
      if(err)
        return res.status(400).send({ err: err });
      else {
        return res.send({ notification: true });
      }
    });
});

router.post('/newVisitor', (req, res) => {

  const number = req.body.number;
  const type = req.body.type;
  const visitor = req.body.visitor;

  db.query('INSERT INTO notificacao (number, type, notification, visitor) VALUES (?, ?, ?, ?)',
  [number, type, null, visitor],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      return res.send({ notification: true });
    }
  });
});

router.get('/newResponse', (req, res) => {
  db.query('SELECT * FROM visitantesNotificacao',
  [],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      var count = 0;
      result.forEach(() => {
        count++;
      });
      return res.send({ visitors: count });
    }
  });
});

router.get('/authorizedVisitors', (req, res) => {
  db.query('SELECT * FROM visitantesNotificacao ORDER BY uid desc',
  [],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      const number = [];
      const name = [];
      const date = [];

      result.forEach(result => {
        number.push(result.number);
        name.push(result.name);
        date.push(result.date);
      });

      return res.send({ number: number, name: name, date: date });
    }
  })
});

router.use(authMiddleware);
router.use(userMiddleware);

router.get('/getNotification', (req, res) => {

  db.query('SELECT * FROM notificacao WHERE number = ? ORDER BY uid desc',
  [req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      return res.send({ result: result });
    }
  });
});

router.post('/responseNotification', (req, res) => {

  const uid = req.body.uid;
  const name = req.body.name;
  const authorized = req.body.authorized;

  db.query('DELETE FROM notificacao WHERE uid = ?',
  [uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      db.query('INSERT INTO visitantesNotificacao (number, name, date, authorized) VALUES (?, ?, ?, ?)',
      [req.number, name, getDate(), authorized],
      (err, result) => {
        if(err)
          return res.status(400).send({ err: err });
        else {
          return res.send({ visitor: true });
        }
      });
    }
  });
});

router.delete('/discardNotification', (req, res) => {

  const uid = req.body.uid;

  db.query('DELETE FROM notificacao WHERE uid = ?',
  [uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      return res.send({ delete: true });
    }
  });
});

module.exports = app => app.use('/notificacao', router);
