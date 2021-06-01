const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

router.use(authMiddleware);
router.use(userMiddleware);

router.put('/modify', (req, res) => {

  const uid = req.body.visitas_uid;
  const type = req.body.type;
  const text = req.body.text;
  const date = req.body.date;
  const seg = req.body.seg;
  const ter = req.body.ter;
  const qua = req.body.qua;
  const qui = req.body.qui;
  const sex = req.body.sex;
  const sab = req.body.sab;
  const dom = req.body.dom;

  db.query('UPDATE visitas SET type = ?, text = ?, date = ?, seg = ?, ter = ?, qua = ?, qui = ?, sex = ?, sab = ?, dom = ? WHERE uid = ?',
  [type, text, date, seg, ter, qua, qui, sex, sab, dom, uid],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'not changed' });
    else
      return res.send({ changed: true });
  });
});

router.get('/getVisitas', (req, res) => {
  db.query('SELECT * FROM visitantes WHERE number = ?',
  [req.number],
  (err, result) => {
    if(err)
      return res.status(400).send({ error: 'fail to get visitantes' });
    else {
      db.query('SELECT * FROM visitas WHERE number = ?',
      [req.number],
      (err, result2) => {
        if(err)
          return res.status(400).send({ error: 'fail to get visitas' });
        else {
          let json = [];
          for(var i = 0; i < result.length; i++) {
            for(var j = 0; j < result2.length; j++) {
              if(result[i].uid === result2[j].visitantes_uid) {
                json.push({
                  uid: result[i].uid,
                  name: result[i].name,
                  img_name: result[i].img_name,
                  visitas_uid: result2[j].uid,
                  type: result2[j].type,
                  text: result2[j].text,
                  date: result2[j].date,
                  seg: result2[j].seg,
                  ter: result2[j].ter,
                  qua: result2[j].qua,
                  qui: result2[j].qui,
                  sex: result2[j].sex,
                  sab: result2[j].sab,
                  dom: result2[j].dom
                });
              }
            }
          }
          return res.send({ visitantes: json })
        }
      });
    }
  });
});

module.exports = app => app.use('/visitas', router);
