const app = require('./src/app')
require('dotenv').config()

console.clear()
console.log(new Date(), 'index.js::[5] initializing')

app.run()
