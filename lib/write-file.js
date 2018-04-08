const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = function(filePath, content) {
    let dir = path.dirname(filePath);

    if (!fs.existsSync(dir)){
        mkdirp.sync(dir);
    }

    fs.writeFileSync(filePath, content);
};
