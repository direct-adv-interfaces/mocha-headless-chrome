const { writeFileSync, mkdirSync, existsSync } = require('node:fs');
const { dirname } = require('node:path');

module.exports = function (filePath, content) {
  let dir = dirname(filePath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, content);
};
