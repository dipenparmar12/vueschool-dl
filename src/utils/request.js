const https = require('https')
const fs = require('fs')
const logger = require('./logger')

/**
 * Download a resource from `url` to `dest`.
 * @param {string} url - Valid URL to attempt download of resource
 * @param {string} dest - Valid path to save the file.
 * @returns {Promise<void>} - Returns asynchronously when successfully completed download
 * @see https://stackoverflow.com/a/62786397/8592918
 */
module.exports.download_stream = function download_stream(url, dest) {
  try {
    return new Promise((resolve, reject) => {
      // Check file does not exist yet before hitting network
      fs.access(dest, fs.constants.F_OK, (err) => {
        if (err === null) reject('File already exists')

        const request = https.get(url, (response) => {
          if (response.statusCode === 200) {
            const file = fs.createWriteStream(dest, { flags: 'wx' })
            file.on('finish', () => resolve())
            file.on('error', (err) => {
              file.close()
              if (err.code === 'EEXIST') reject('File already exists')
              else fs.unlink(dest, () => reject(err.message)) // Delete temp file
            })
            response.pipe(file)
          } else if (
            response.statusCode === 302 ||
            response.statusCode === 301
          ) {
            //Recursively follow redirects, only a 200 will resolve.
            download_stream(response.headers.location, dest).then(() =>
              resolve()
            )
          } else {
            reject(
              `Server responded with ${response.statusCode}: ${response.statusMessage}`
            )
          }
        })

        request.on('error', (err) => {
          reject(err.message)
        })
      })
    })
  } catch (error) {
    console.log('request.js::[45] error', error, url, dest)
    logger.error(error.toString())
  }
}
