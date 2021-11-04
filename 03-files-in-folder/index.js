const fs = require('fs');
const path = require('path');
const BYTES_IN_KB = 1000;

fs.readdir(path.join(__dirname, 'secret-folder'),
    {withFileTypes: true},
    (err, files) => {

        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
                        console.log(`${path.basename(file.name, path.extname(file.name))} - ${path.extname(file.name).slice(1)} - ${stats.size / BYTES_IN_KB}kb`);

                    })
                }

            });

        }
    });
