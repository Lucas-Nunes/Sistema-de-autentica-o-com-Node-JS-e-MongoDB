const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    
    userDocument: {
        type: String,
        required: true
    },
    card:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    creditCardToken : {
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    blacktoken:{
        type: [],
        required: false,
        expire_at: {type: Date, default: Date.now, expires: 900}
    }
})
mongoose.model('users', UsersSchema )