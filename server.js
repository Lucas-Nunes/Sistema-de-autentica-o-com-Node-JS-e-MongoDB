const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors')
const logger = require('./src/ErrorControll/logger.js')
const accessLogStream = require('./src/ErrorControll/request.js')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
app = express()

app.use(
    cors({
      origin: 'http://localhost:3001',
      credentials: true,
    })
  )

app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc:      ["'self'"],
      styleSrc:        ["'self'"]
    },
    reportOnly: (req, res) => req.query.cspmode === 'debug' //block old browsers
}))

app.use(helmet.featurePolicy({
  features: {
    syncXhr:     ["'none'"],
    camera:      ["'none'"],
    geolocation: ["'none'"],
    microphone:  ["'none'"],
    speaker:     ["'none'"],
    usb:         ["'none'"],
    autoplay:    ["'none'"]
  }
}))

app.use(helmet.permittedCrossDomainPolicies())

app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://localhost:27017', { useUnifiedTopology: true, useNewUrlParser: true}, (err, db) => {
    if(err){
        logger.log({
            level: 'error',
            message: 'Unable to connect to the server. Please start the server. Error:', err
        })
        process.exit()
    }else{
        logger.log({
            level: 'info',
            message: 'Connected to Server successfully!'
          })
    }
})

requireDir('./src/models')
const routes = require('./src/routes')

app.use(morgan(':date[clf] :method HTTP/:http-version :url (:status) TIME(:response-time ms) REF[:referrer] REQ-IP[:ip] :remote-user RESPONSE-TIME[:response-time[digits] ms] USER-AGENT :user-agent HEADERS :req-headers', { stream: accessLogStream }))

app.use(express.json())
app.use(cookieParser())
app.use(compression())

app.use((err, req, res, next) => {
    logger.log({
        level: 'error',
        message: 'Internal Server Error ! Error:', err
      })
    res.status(500).json({ message: 'Internal server error !'})
})

app.use('/', routes)

app.listen(3001, () => {
    logger.log({
        level: 'info',
        message: 'server listening in 3001'
    })
})