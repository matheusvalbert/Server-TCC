const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const fs = require('fs');
const path =  require('path').join(__dirname, '..', '/detected/');

router.post('/getImages', (req, res) => {

  const plate = req.body.plate;
  const face = req.body.face;

  if(plate !== false) {
    const base64DataPlate = plate.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFile(path + 'plate.jpeg', base64DataPlate, 'base64', (err) => {
      if(err)
        console.log(err);
    });
  }

  if(face !== false) {
    const base64DataFace = face.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFile(path + 'face.jpeg', base64DataFace, 'base64', (err) => {
      if(err)
        console.log(err);
    });
  }

  return res.send({ result: 'ok' });
});

module.exports = app => app.use('/recognition', router);
