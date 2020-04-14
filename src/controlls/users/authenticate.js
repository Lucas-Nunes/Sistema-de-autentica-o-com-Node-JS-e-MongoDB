const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = mongoose.model('users')
const config = require('./../../config.json')

module.exports = {
    async authenticateUser(req, res, next){
        if (!(req.body.username && req.body.password)) return res.send({'err':'mandatory fields not filled'})
        const user = await User.findOne({'username':req.body.username})

        if(user && bcrypt.compareSync(req.body.password, user.password)){
            const Userid = CryptoJS.AES.encrypt(user.id, config.secret).toString()
            const token  =  jwt.sign({ sub: Userid}, config.secret, {expiresIn: config.exp})
            return res.cookie('x-access-token',token, { maxAge: 600000, httpOnly: true }).send({'info':'successfully authenticated'})
        }else return res.status(400).send({'err':'Username or password is incorrect'})    
    }
}