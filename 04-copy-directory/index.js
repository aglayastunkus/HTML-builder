const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, (err) => {
    if (err) {
        throw err;
    }

    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
        if (err) throw err;
        console.log('Folder is created.');
    });

    fs.readdir(path.join(__dirname, 'files'),
        {withFileTypes: true},
        (err, files) => {

            if (err)
                console.log(err);
            else {
                files.forEach(file => {
                    fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), function (err) {
                        if (err) throw err;
                    });

                });

            }
        });
});


