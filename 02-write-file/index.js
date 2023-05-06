const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
});
const output = fs.createWriteStream(path.join('./02-write-file', 'text.txt'), {flags: 'a', encoding: 'utf-8'});

function getInput() {
  console.log('Enter something (terminate: Ctrl + C or exit): ');
  rl.question('', (str) => {
    if (str === 'exit') {
      console.log('Exiting...');
      rl.close();
    } else {
      output.write(`${str}`);
      getInput();
    }
  });
}

process.on('SIGINT', () => {
  console.log('Process is terminated.');
  process.exit(0);
});

console.log('Hello!');
getInput();
