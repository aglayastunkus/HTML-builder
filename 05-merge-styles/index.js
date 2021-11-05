const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (err, files) => {

    if (err) console.log(err);

    else {

        let array = [];

        files.forEach(file => {

            if (file.isFile() && (path.extname(file.name) === '.css')) {

                fs.readFile(path.join(__dirname, 'styles', `${file.name}`), (err, data) => {

                    if (err) throw err;
                    
                    let subArray = data.toString().split("\n");

                    array = array.concat(subArray);

                    let file = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

                    file.on('error', err => {
                        console.log(err)
                    });

                    array.forEach(value => file.write(`${value}\n`));

                    file.end();
                });

            }

        });

    }

});

