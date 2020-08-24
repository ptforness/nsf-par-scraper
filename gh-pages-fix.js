const fs = require('fs');
const filePath = './docs/config.yml';
const data = "include:\n- \"_*_.html\"\n- \"_*_.*.html\"";
fs.writeFileSync(filePath, data);