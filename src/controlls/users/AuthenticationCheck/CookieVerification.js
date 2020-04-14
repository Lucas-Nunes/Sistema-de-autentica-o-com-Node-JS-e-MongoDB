const mongoose = require('mongoose')
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken')
const User = mongoose.model('users')
const config = require('./../../../config.json')
const logger = require('./../../../ErrorControll/logger.js')

module.exports = {

    async verifyJWT(req, res, next){

        const token = req.cookies['x-access-token']

        if (!token && token === " " && token === null) return res.status(301).send({'err':'user not logged in'})

        jwt.verify(token, config.secret, (err, decoded) => {
            if (err){
                logger.log({
                    level: 'error',
                    message: err
                })
                return res.status(301).send({'err':'Invalid Token'})
            }

            let IDencrypted = decoded.sub
            const idDecrypt  = CryptoJS.AES.decrypt(IDencrypted, config.secret)
            const id = idDecrypt.toString(CryptoJS.enc.Utf8)

            async function findblacktoken(id, token){
                const user = await User.findById(id)
                if(!(user)) return res.status(301).send({'err':'Invalid Token'})
                    for(let i=0; i <= user.blacktoken.length; i++){
                        if(user.blacktoken[i] === token){
                            return res.status(301).send({'err':'user was logout'})
                            break
                        }
                    }
                req.body.id = IDencrypted
                return next()
            }
            findblacktoken(id,token)  
        })
    }
}
