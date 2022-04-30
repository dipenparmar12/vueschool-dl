/* eslint-disable no-useless-escape */

module.exports.slugify = function slugify(str) {
  return str
    .toString() // Cast to string (optional)
    .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/\-/g, ' ')
}

/**
 *
 * @param {String} str - string to format
 * @returns {String} - formatted string
 * @example
 * capitalize('hello-world') // 'Hello World'
 * capitalize('hello_World') // 'Hello World'
 * capitalize('hello-word_how_are-you') // 'Hello word how are you'
 */
module.exports.capitalize = function capitalize(
  str,
  regex = /[_-]/g,
  replacer = ' '
) {
  const sanitized = str.replace(regex, replacer)
  return sanitized.charAt(0).toUpperCase() + sanitized.slice(1)
}

/**
 *
 * @param {String} str - string to format
 * @returns {String} - formatted string
 * @example
 * capitalize('hello-world') // 'Hello World'
 * capitalize('hello_World') // 'Hello World'
 * capitalize('hello-word_how_are-you') // 'Hello word how are you'
 */
module.exports.sensitize = function (str) {
  return this.capitalize(this.slugify(str))
}
