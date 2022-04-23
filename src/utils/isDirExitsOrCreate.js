var fs = require('fs');
/**
 * If Directory not exits, create new directory & return path
 * @param {*} dir 
 * @param {*} recursive 
 * @returns String
 */
const isDirExitsOrCreate = (dir, recursive= true)=>{
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive });
  }

  return dir
}


module.exports = isDirExitsOrCreate