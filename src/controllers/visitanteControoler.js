const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');
const multer = require('multer');
const multerConfig = require('../config/multer');
const path =  require('path').join(__dirname, '..', '/img/');
const fs = require('fs');

router.use(authMiddleware);
router.use(userMiddleware);

router.get('/profileImage/:imgName', (req, res) => {

  try {
    if (fs.existsSync(path + req.params.imgName)) {

      return res.sendFile(path + req.params.imgName);
    }
  } catch(err) {

    return res.status(400).send({ error: err });
  }
});

router.put('/completeModify', multer(multerConfig).single('file'), (req, res) => {

  const name = req.body.name;
  const plate = req.body.plate;
  const uid = req.body.uid;

  db.query('SELECT * FROM visitantes WHERE uid = ?',
  [uid],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get visitantes' });
    else {
      fs.unlink(path + result[0].img_name, (err) => {
        if (err)
          return res.status(400).send({ error: 'falha ao apagar usuario' });
      });
      db.query('UPDATE visitantes SET name = ?, plate = ?, img_name = ? WHERE uid = ?',
      [name, plate, req.file.filename, uid],
      (err, result) => {
        if(err)
          return res.status.send({ error: 'fail to get visitantes' });
        else {
          return res.send({ completeModify: true });
        }
      });
    }
  });
});

router.patch('/modify', (req, res) => {

  const name = req.body.name;
  const plate = req.body.plate;
  const uid = req.body.uid;

  db.query('UPDATE visitantes SET name = ?, plate = ? WHERE uid = ?',
  [name, plate, uid],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get visitantes' });
    else {
      return res.send({ modify: true });
    }
  });
});

router.delete('/delete', (req, res) => {

  const uid = req.body.uid;

  db.query('SELECT * FROM visitantes WHERE uid = ?',
  [uid],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get visitantes' });
    else {
      fs.unlink(path + result[0].img_name, (err) => {
        if (err)
          return res.status(400).send({ error: 'falha ao apagar usuario' });
      });
      db.query('DELETE FROM visitantes WHERE uid = ?',
      [uid],
      (err, result) =>{
        if(err)
          return res.status(400).send({ error: 'falha ao apagar usuario' });
        else
          return res.send({ visitanteDeleted: true });
      });
    }
  });
});

router.post('/add', multer(multerConfig).single('file'), (req, res) => {

  const name = req.body.name;
  const plate = req.body.plate;

  if(req.file && name !== undefined)
    db.query('INSERT INTO visitantes (name, plate, img_name, number) VALUES (?, ?, ?, ?)',
    [name, plate, req.file.filename, req.number],
    (err, result) =>{
      if(err)
        return res.status(400).send({ insertedUser: false });
      else
        return res.send({ insertedUser: true });
    });
  else
    return res.status(400).send({ error: 'image not found' });
});

router.get('/getUsers', (req, res) => {

  db.query('SELECT * FROM visitantes WHERE number = ?',
  [req.number],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get visitantes' });
    else
      return res.send({ result: result });
  });
});

module.exports = app => app.use('/visitante', router);
