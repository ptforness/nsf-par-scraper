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

function rename(folder) {
    fs.readdirSync(folder).forEach(file => {
        if(file.startsWith('_')) {
            fs.renameSync(path.join(folder, file), path.join(folder, file.substring(1)));
        }
    })
}