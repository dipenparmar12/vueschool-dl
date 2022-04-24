var fs = require('fs');
/**
 * get files names from directory
 * @param {*} dir 
 * @param {*} recursive 
 * @returns String
 */
const getFilesOfDir = (dir) => {
  return fs.readdirSync(dir).map(file => file);
}


module.exports = getFilesOfDir