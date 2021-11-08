const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const readDate = async (path) => {
    const file = fs.createReadStream(path);
    let data = '';
    for await (const piece of file) {
        data += piece;
    }
    return data;

};

const getStyles = async () => {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    let styles = [];
    for (let file of files) {
        if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
            const data = await readDate(path.join(__dirname, 'styles', file.name));
            styles.push(data);
        }
    }
    return styles;
};

(async function () {
    const outputStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');
    for (let style of await getStyles()) {
        outputStyles.write(`${style}\n`);
    }
}());

