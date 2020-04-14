const register = require('./controlls/users/register.js')
const authenticate = require('./controlls/users/authenticate')
const DisplayUserData = require('./controlls/users/DisplayUserData.js')
const CookieVerification = require('./controlls/users/AuthenticationCheck/CookieVerification.js')
const logout = require('./controlls/users/logout.js')
const DeleteAccount = require('./controlls/users/delete.js')
const update = require('./controlls/users/update.js')
const express = require('express')
const router = express.Router()

router.post('/authenticate',authenticate.authenticateUser)
router.post('/register',register.registerUser)
router.get('/account',CookieVerification.verifyJWT, DisplayUserData.ShowData)
router.get('/logout',CookieVerification.verifyJWT, logout.quit)
router.delete('/delete/account',CookieVerification.verifyJWT, DeleteAccount.delete)
router.put('/account/update',CookieVerification.verifyJWT, update.UpdateUserData)

module.exports = router