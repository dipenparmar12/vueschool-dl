const fs = require('fs')

/**
 * Get list of files from specified directory
 * @param {*} dir
 * @returns file
 * @see https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
 */
module.exports.getFiles = async (dir) => {
  if (!fs.existsSync(dir)) {
    console.error('fileSystem.js::[11] dir not exits::', dir)
    return []
  }

  return fs.readdirSync(dir, (err, files) => files.map((file) => file))
}

module.exports.fileExits = (dir) => {
  return !!fs.existsSync(dir)
}

/**
 * If Directory not exits, create new directory & return path
 * @param {*} dir
 * @param {*} recursive
 * @returns String
 */
module.exports.isDirExitsOrCreate = async (dir, recursive = true) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive })
  }
  return dir
}
