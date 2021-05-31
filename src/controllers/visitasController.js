const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const authMiddleware = require('../middlewares/auth');
const userMiddleware = require('../middlewares/user');

router.use(authMiddleware);
router.use(userMiddleware);

router.get('/getVisitas', (req, res) => {
  db.query('SELECT * FROM visitantes WHERE number = ?',
  [req.number],
  (err, result) => {
    if(err)
      return res.status.send({ error: 'fail to get visitantes' });
    else {
      db.query('SELECT * FROM visitas WHERE number = ?',
      [req.number],
      (err, result2) => {
        if(err)
          return res.status.send({ error: 'fail to get visitas' });
        else {
          let json = [];
          for(var i = 0; i < result.length; i++) {
            for(var j = 0; j < result2.length; j++) {
              if(result[i].uid === result2[j].visitantes_uid) {
                json.push({
                  uid: result[i].uid,
                  name: result[i].name,
                  img_name: result[i].img_name,
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
