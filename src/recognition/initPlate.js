const { spawn } = require('child_process');

const plateRecognition = spawn('python3', ['src/recognition/plate.py']);

plateRecognition.stdout.on('data', (data) => {
  console.log(`stdout ${data}`);
});

plateRecognition.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

plateRecognition.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

plateRecognition.Promise = global.Promise;

module.exports = plateRecognition;
