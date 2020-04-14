const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const User = mongoose.model('users')
const config = require('./../../config.json')

module.exports = {
    
    async delete(req, res, next){
        let id = req.body.id
        const token = req.cookies['x-access-token']

        if(!(id)) return res.send({'err':'The user has not been authenticated'})

        const idDecrypt  = CryptoJS.AES.decrypt(id, config.secret)
        id = idDecrypt.toString(CryptoJS.enc.Utf8)

        const user = await User.findById(id)
        await user.blacktoken.push(token)

        try{
            await user.save()
        }catch{
            return res.send({'err':'error when logout'})
        }finally{
            await User.findOneAndDelete(id)
            return res.cookie('x-access-token', null ,{ maxAge: 1, httpOnly: true }).send({'info':'account successfully deleted'})
        }
    }
}