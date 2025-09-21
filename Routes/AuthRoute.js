const express = require('express');
const router = express.Router();
const {register, login,logout} = require('../Controllers/AuthController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const {body} = require('express-validator')
const {validate} = require('../Middleware/Validate')


router.post('/register',[body('username').trim().notEmpty().withMessage('Username is Required').isLength({min: 5}).withMessage('Username should be atleast 5 characters'),
    body('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').isLength({min : 6}).withMessage('Passsword must have atleast 6 characters')
],validate,register);

router.post('/login',[body('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').isLength({min : 6}).withMessage('Password must be of atleast 6 characters')
],validate,login);

router.use(AuthMiddleware);
router.get('/profile',(req, res)=>{
    res.json({"Message ":"Your Profile","User":req.user})
});
router.post('/logout',logout);


module.exports = router;