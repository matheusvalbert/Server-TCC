const { spawn } = require('child_process');

const faceRecognition = spawn('python3', ['src/recognition/face.py']);

faceRecognition.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

faceRecognition.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

faceRecognition.Promise = global.Promise;

module.exports = faceRecognition;
