const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const moradorMiddleware = require('../middlewares/morador');
const multer = require('multer');
const multerConfig = require('../config/multer');
const path =  require('path').join(__dirname, '..', '/img');

router.use(authMiddleware);
router.use(moradorMiddleware);

router.get('/profileImage/:imgName', (req, res) => {

  return res.sendFile(path + '/' + req.params.imgName);
});

router.post('/add', multer(multerConfig).single('file'), (req, res) => {

  const name = req.body.name;
  const plate = req.body.plate;

  if(req.file && name !== undefined)
    db.query('INSERT INTO moradores (name, plate, img_name, number) VALUES (?, ?, ?, ?)',
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

  db.query('SELECT * FROM moradores WHERE number = ?',
  [req.number],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get moradores' });
    else
      return res.send({ result: result });
  });
});

module.exports = app => app.use('/morador', router);
