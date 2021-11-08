const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const copyDirectory = async (src, dest) => {
    const entries = await fsPromises.readdir(src, {withFileTypes: true});
    await fsPromises.mkdir(dest);
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fsPromises.copyFile(srcPath, destPath);
        }
    }
};

const readData = async (path) => {
    const file = fs.createReadStream(path);
    let data = '';
    for await (const piece of file) {
        data += piece;
    }
    return data;
};

const buildTemplate = async () => {
    let template = await readData(path.join(__dirname, 'template.html'));
    const files = await fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    let components = {};
    for (let file of files) {
        const extension = path.extname(path.join(__dirname, 'components', file.name));
        if (file.isFile() && extension === '.html') {
            components[path.basename(path.join(__dirname, 'components', file.name), extension)] = await readData(path.join(__dirname, 'components', file.name));
        }
    }
    for (let key in components) {
        template = template.replace(`{{${key}}}`, components[key]);
    }
    return template;
};

const getStyles = async () => {
    const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    let styles = [];
    for (let file of files) {
        if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
            const data = await readData(path.join(__dirname, 'styles', file.name));
            styles.push(data);
        }
    }
    return styles;
};

(async () => {
    await fsPromises.rmdir(path.join(__dirname, 'project-dist'), {recursive: true});
    await fsPromises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

    await copyDirectory(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));

    const outputTemplate = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
    outputTemplate.write(`${await buildTemplate()}`);

    const outputStyles = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
    for (let style of await getStyles()) {
        outputStyles.write(`${style}\n`);
    }
})();
