const fs = require('fs');
const path = require('path');
//const filePath = './docs/config.yml';
//const data = "include:\n- \"_*_.html\"\n- \"_*_.*.html\"";
//fs.writeFileSync(filePath, data);

const documentationFolder = './docs/';
const interfaces = path.join(documentationFolder, 'interfaces/');
const modules = path.join(documentationFolder, 'modules/');
rename(interfaces);
rename(modules);
fixLinks(documentationFolder)
fixLinks(interfaces);
fixLinks(modules);

function rename(folder) {
    fs.readdirSync(folder).forEach(file => {
        if(file.startsWith('_')) {
            fs.renameSync(path.join(folder, file), path.join(folder, file.substring(1)));
        }
    });
}

function fixLinks(folder) {
    const regex = /(?:href\=\")(.*?)(?:\")/g;
    fs.readdirSync(folder).forEach(file => {
        if(file.endsWith('.html')) {
            fs.readFile(path.join(folder, file), 'utf8', (err, data) => {
                if (err) {
                    throw err;
                }
                const matches = data.match(regex);
                for (const match of matches) {
                    if (match.startsWith('href="_')) {
                        data = data.replace(match, match.replace('_', ''));
                    }
                }

                fs.writeFile(path.join(folder, file), data, 'utf8', err => {
                    if (err) {
                        throw err;
                    }
                });
            });
        }
    });
}