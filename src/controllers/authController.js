const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/mysql');
const authConfig = require('../config/auth');
const authMiddleware = require('../middlewares/auth');

function generateToken(id = {}) {
  return jwt.sign({ id }, authConfig.secret);
}

router.post('/register', async (req, res) => {

  const login = req.body.login;
  const password = req.body.password;

  await bcrypt.hash(password, 10).then((psw) => {
    db.query('INSERT INTO user (login, password) VALUES (?, ?)',
    [login, psw],
    (err, result) => {
      if(err)
        return res.status(400).send({ error: err });
      else
        return res.send({ result });
    });
  });
});

router.post('/login', async (req, res) => {

  const login = req.body.login;
  const password = req.body.password;

  db.query('SELECT * FROM user WHERE login = ?',
  [login],
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

          const id = result[0].id;

          return res.send({
            result,
            token: generateToken(id)
          });
        }
    }
  });
});

router.use(authMiddleware).post('/reset', async (req, res) => {

  const password = req.body.password;

  await bcrypt.hash(password, 10).then((psw) => {
    db.query('UPDATE user SET password = ? WHERE id = ?',
    [psw, req.userId],
    (err, result) => {
      if(err)
        return res.status(400).send({ error: err });
      else
        res.send({ result });
    });
  });
})

module.exports = app => app.use('/auth', router);
