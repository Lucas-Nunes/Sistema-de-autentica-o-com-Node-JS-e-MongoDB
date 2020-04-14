const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const bcrypt = require('bcrypt')
const User = mongoose.model('users')
const config = require('./../../config.json')

module.exports = {
    
    async registerUser(req, res, next){

        if(!(req.body.username && req.body.password && req.body.userDocument && req.body.card)) return res.send({'err':'mandatory fields not filled'})
        if(await User.findOne({'username':req.body.username})) return res.send({'err':'Username is already taken'})
        
        const user = new User(req.body)
                
        user.password = bcrypt.hashSync(req.body.password, 10)
            
        const userDocument   = await req.body.userDocument
        user.userDocument    = CryptoJS.AES.encrypt(userDocument, config.secret).toString()
            
        const card           = await req.body.card
        user.card            = CryptoJS.AES.encrypt(card, config.secret).toString()

        user.blacktoken = ""
                
        try{
            await user.save()
        }catch(err){
            return res.send({'err':'error when registering'})
        }finally{
            return res.send({'info':'registered successfully'})
        }
    }
}