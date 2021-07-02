const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const authConfig = require('../config/auth');
const path = require('path').join(__dirname, '..', '/img/');
const fs = require('fs');
const faceRecognition = require('../recognition/initFace');

function generateToken(id = {}) {
  return jwt.sign({ id }, authConfig.secret);
}

//not auth routes

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

//auth Routes
router.use(authMiddleware);

router.get('/getUsers', (req, res) => {

  db.query('SELECT username, uid FROM users',
  (err, result) => {
    try {
      id = [];
      user = [];
      for(i = 1;  i < result.length; i++) {
        id.push(result[i].uid);
        user.push(result[i].username);
      }
      const users = ({ id, user });
      return res.send({ users });
    }
    catch(error) {
      return res.status(400).send(error);
    }
  });
});

router.delete('/delete', (req, res) => {

  if(req.userId !== 1 && username !== 'admin')
    return res.status(400).send({ insertedUser: 'not authorized' });

  const username = req.body.username;

  db.query('SELECT uid FROM users WHERE username = ?',
  [username],
  (err, uid) => {
    if(err)
      return res.status(400).send({ err: err });
    else {
      db.query('SELECT number FROM users WHERE uid = ?',
      [uid[0].uid],
      (err, number) => {
        if(err)
          return res.status(400).send({ err: err });
        else {
          db.query('DELETE FROM users WHERE username = ?',
          [username],
          (err, result) => {
            if(err)
              return res.status(400).send({ err: err });
            else {
              db.query('SELECT * FROM users WHERE number = ?',
              [number[0].number],
              (err, result1) => {
                if(err)
                  return res.status(400).send({ err: err });
                else {
                  if(result1.length === 0) {
                    db.query('SELECT * FROM moradores WHERE number = ?',
                    [number[0].number],
                    (err, img) => {
                      if(err)
                        return res.status(400).send({ err: err });
                      else {
                        for(var i = 0; i < img.length; i++) {
                          faceRecognition.stdin.write(`{"face": "${false}", "new": "${false}", "delete": "${img[i].img_name}"}\n`);
                          faceRecognition.stdin.pause();
                          fs.unlink(path + img[i].img_name, (err) => {
                            if (err)
                              return res.status(400).send({ error: 'falha ao apagar imagens' });
                          });
                        }
                      }
                    });
                    db.query('SELECT * FROM visitantes WHERE number = ?',
                    [number[0].number],
                    (err, img) => {
                      if(err)
                        return res.status(400).send({ err: err });
                      else {
                        for(var i = 0; i < img.length; i++) {
                          faceRecognition.stdin.write(`{"face": "${false}", "new": "${false}", "delete": "${img[i].img_name}"}\n`);
                          faceRecognition.stdin.pause();
                          fs.unlink(path + img[i].img_name, (err) => {
                            if (err)
                              return res.status(400).send({ error: 'falha ao apagar imagens' });
                          });
                        }
                      }
                    });

                    db.query('DELETE FROM listas WHERE number = ?', [number[0].number]);
                    db.query('DELETE FROM moradores WHERE number = ?', [number[0].number]);
                    db.query('DELETE FROM reserva_ambientes WHERE number = ?', [number[0].number]);
                    db.query('DELETE FROM visitantes WHERE number = ?', [number[0].number]);
                    db.query('DELETE FROM visitas WHERE number = ?', [number[0].number]);
                  }
                  return res.send({ userDeleted: true });
                }
              });
            }
          });
        }
      });
    }
  });
})

router.patch('/masterReset', (req, res) => {

  const username = req.body.username;
  const newPassword = req.body.newPassword;

  if(req.userId !== 1 && username !== 'admin')
    return res.status(400).send({ insertedUser: 'not authorized' });

  bcrypt.hash(newPassword, 10).then((psw) => {
    db.query('UPDATE users SET password = ? WHERE username = ?',
    [psw, username],
    (err, result) => {
      if(err)
        return res.status(400).send({ error: 'falha na troca de senha' });
      else
        return res.send({ passwordChanged: true });
    });
  });
});

router.post('/register', (req, res) => {

  if(req.userId !== 1)
    return res.status(400).send({ insertedUser: 'not authorized' });

  const username = req.body.username;
  const password = req.body.password;
  const number = req.body.number;

  bcrypt.hash(password, 10).then((psw) => {
    db.query('INSERT INTO users (username, password, number) VALUES (?, ?, ?)',
    [username, psw, number],
    (err, result) => {
      if(err)
        return res.status(400).send({ insertedUser: false });
      else
        return res.send({ insertedUser: true });
    });
  });
});

router.patch('/reset', (req, res) => {

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
              return res.send({ passwordChanged: true });
          });
        });
  })
})

router.post('/validate', (req, res) => {
  return res.send({ validToken: 'true', uid: req.userId });
})

module.exports = app => app.use('/auth', router);
