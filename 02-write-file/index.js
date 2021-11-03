const readline = require('readline');
const {stdout} = process;

const rl = readline.createInterface(
    process.stdin, process.stdout);

const fs = require('fs');
const path = require('path');


rl.setPrompt(`You can write whatever you want!\n`);
rl.prompt();
rl.on('line', (text) => {
    if (text === 'exit') {
        rl.close()
    } else {
        fs.appendFile(
            path.join(__dirname, 'text.txt'),
            `${text}\n`,
            err => {
                if (err) throw err;
            }
        );
    }
});
process.on('exit', () => stdout.write('Good luck!'));

