const express = require('express');
const router = express.Router();
const db = require('../database/mysql');
const fs = require('fs');
const path =  require('path').join(__dirname, '..', '/detected/');
const faceRecognition = require('../recognition/initFace');
const plateRecognition = require('../recognition/initPlate');

router.post('/getImages', (req, res) => {

  const plate = req.body.plate;
  const face = req.body.face;

  if(plate !== false) {
    plateRecognition.stdin.write(`{"plate": "${plate}"}\n`);
    plateRecognition.stdin.pause();
    const base64DataPlate = plate.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFile(path + 'plate.jpeg', base64DataPlate, 'base64', (err) => {
      if(err)
        console.log(err);
    });
  }

  if(face !== false) {
    faceRecognition.stdin.write(`{"face": "${face}", "new": "${false}", "delete": "${false}"}\n`);
    faceRecognition.stdin.pause();
  }

  return res.send({ result: 'ok' });
});

module.exports = app => app.use('/recognition', router);
