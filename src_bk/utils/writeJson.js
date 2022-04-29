const fse = require("fs-extra");

/**
 * Create json file
 * @param {*} path
 * @param {*} jsonData 
 * @returns String
 */
const writeJson = (path, jsonData) => {
  // path.join(
  //   __dirname,
  //   "..",
  //   "course-video-lists",
  //   fileName.replace(" ", "-").toLowerCase()
  // )
  fse.outputFile(path, JSON.stringify(jsonData) )
}


module.exports = isDirExitsOrCreate