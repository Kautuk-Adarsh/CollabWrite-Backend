const express = require('express')
const router = express.Router()
const {UpdateUser,DeleteUser, GetUsers, AdminDeleteUser} = require('../Controllers/UserController')
const AuthMiddleware = require ('../Middleware/AuthMiddleware')
const {isAdmin} = require('../Middleware/Admin')

router.use(AuthMiddleware)

router.put('/update/:id',UpdateUser)
router.delete('/delete/:id',DeleteUser)
router.delete('/admin/delete/:id',isAdmin,AdminDeleteUser)
router.get('/allusers',isAdmin,GetUsers )

module.exports = router;