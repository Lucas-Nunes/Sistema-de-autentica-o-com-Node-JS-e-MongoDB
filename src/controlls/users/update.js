const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const bcrypt = require('bcrypt')
const User = mongoose.model('users')
const config = require('./../../config.json')

module.exports = {
    
  async UpdateUserData(req, res, next){
        let id = req.body.id
        let userParam = req.body

        if(!(id)) return res.send({'err':'The user has not been authenticated'})

        const idDecrypt  = CryptoJS.AES.decrypt(id, config.secret)
        id = idDecrypt.toString(CryptoJS.enc.Utf8)
        const user = await User.findByIdAndUpdate(id)

        if(!(user)) return res.send({'err':'User not found'})

        if(userParam.username !== null && userParam.username !== ""){
            if (user.username != userParam.username && await User.findOne({ username: userParam.username })) {
                return res.send({'err':'Username ' + userParam.username + ' is already taken'})
            }else userParam.username =  userParam.username
        }else delete userParam.username
    
        if (userParam.password != null && userParam.password !== "") {
            userParam.password = bcrypt.hashSync(userParam.password, 10)
        }else delete userParam.password

        if (userParam.userDocument  != null && userParam.userDocument !== ""){
            const userDocument      = await userParam.userDocument
            userParam.userDocument  = CryptoJS.AES.encrypt(userDocument, config.secret).toString()
        }else delete userParam.userDocument

        if (userParam.card != null && userParam.card !== ""){
            const card              = await userParam.card
            userParam.card          = CryptoJS.AES.encrypt(card, config.secret).toString()
        }else delete userParam.card

        Object.assign(user, userParam)

        try{
            await user.save()
        }catch{
            return res.send({'err':'error when registering'})
        }finally{
            return res.send({'info':'updated successfully'})
        }
    }
}