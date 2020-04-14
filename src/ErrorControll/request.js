const fs = require('fs')
const path = require('path')
const morgan = require('morgan')

morgan.token('req-headers', (req,res) => {
    return JSON.stringify(req.headers)
})
morgan.token('ip',(req, res) => {
    return JSON.stringify(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress)
})
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/access.log'), { flags: 'a' })

module.exports = accessLogStream