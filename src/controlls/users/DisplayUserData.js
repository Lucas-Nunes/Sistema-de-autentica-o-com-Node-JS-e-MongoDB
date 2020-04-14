const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const User = mongoose.model('users')
const config = require('./../../config.json')

module.exports = {
    
    async ShowData(req, res, next){
        let id = req.body.id
        if(!(id)) return res.send({'err':'The user has not been authenticated'})

        const idDecrypt  = CryptoJS.AES.decrypt(id, config.secret)
        id = idDecrypt.toString(CryptoJS.enc.Utf8)
        const user  = await User.find({"_id":id},{"username":1, "userDocument":1, "card": 1, "_id":0})

        if(!(user[0].userDocument && user[0].card && user[0].username)) return res.send({'err':'internal server error'})

        const DocumentoDecrypt =  CryptoJS.AES.decrypt(user[0].userDocument, config.secret)
        const userDocument =  DocumentoDecrypt.toString(CryptoJS.enc.Utf8)
        user[0].userDocument = userDocument
            
        const cardDecrypt =  CryptoJS.AES.decrypt(user[0].card, config.secret)
        const card =  cardDecrypt.toString(CryptoJS.enc.Utf8)
        user[0].card = card
                
        return res.send(user[0])
    }
}