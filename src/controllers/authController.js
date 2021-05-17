const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/mysql');
const authConfig = require('../config/auth');
const authMiddleware = require('../middlewares/auth');
const cors = require('cors');

router.use(cors());

function generateToken(id = {}) {
  return jwt.sign({ id }, authConfig.secret);
}

router.post('/register', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, 10).then((psw) => {
    db.query('INSERT INTO users (username, password) VALUES (?, ?)',
    [username, psw],
    (err, result) => {
      if(err)
        return res.status(400).send({ insertedUser: false });
      else
        return res.send({ insertedUser: true });
    });
  });
});

router.post('/login', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  db.query('SELECT * FROM users WHERE username = ?',
  [username],
  async (err, result) => {
    if(err)
      return res.status(400).send({ error: err });
    else {
      if(result.length === 0)
        return res.status(400).send({ error: 'Usuário não existe' });
      else
        if(!await bcrypt.compare(password, result[0].password))
          return res.status(400).send({ error: 'Senha incorreta' });
        else {
          const uid = result[0].uid;
          const username = result[0].username;
          const token = generateToken(uid);
          return res.send({ uid, username, token });
        }
    }
  });
});

router.use(authMiddleware).patch('/reset', (req, res) => {

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  db.query('SELECT * FROM users WHERE uid = ?',
  [req.userId],
  async (err, result) => {
    if(err)
      return res.status(400).send({ error: 'senha incorreta' });
    else
      if(!await bcrypt.compare(oldPassword, result[0].password))
        return res.status(400).send({ error: 'Senha incorreta' });
      else
        bcrypt.hash(newPassword, 10).then((psw) => {
          db.query('UPDATE users SET password = ? WHERE uid = ?',
          [psw, req.userId],
          (err, result) => {
            if(err)
              return res.status(400).send({ error: 'falha na troca de senha' });
            else
              res.send({ passwordChanged: true });
          });
        });
  })
})

router.use(authMiddleware).post('/validate', (req, res) => {
  res.send({ validToken: 'true', uid: req.userId });
})

module.exports = app => app.use('/auth', router);
