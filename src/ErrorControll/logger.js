const {transports, createLogger, format} = require('winston')
const logger = createLogger({
    format: format.combine(
        format.timestamp({format:'DD-MM-YY HH:mm:ss'}),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: './logs/console.log'})
    ]
})

module.exports = logger