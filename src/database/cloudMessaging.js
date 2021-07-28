const admin = require('firebase-admin');

var serviceAccount = require('../config/firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.Promise = global.Promise;

module.exports = admin;
