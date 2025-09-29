const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const {register, login,logout} = require('../Controllers/AuthController')
const AuthMiddleware = require('../Middleware/AuthMiddleware')
const {body} = require('express-validator')
const {validate} = require('../Middleware/Validate')

const SECRET = process.env.JWT_SECRET; 

router.post('/register',[body('username').trim().notEmpty().withMessage('Username is Required').isLength({min: 5}).withMessage('Username should be atleast 5 characters'),
    body('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').isLength({min : 6}).withMessage('Passsword must have atleast 6 characters')
],validate,register);

router.post('/login',[body('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').isLength({min : 6}).withMessage('Password must be of atleast 6 characters')
],validate,login);

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',
    passport.authenticate('google',{failureRedirect : '/login', session :false}), 
    (req,res)=>{
        
        const user = req.user; 
        
        
        const token = jwt.sign({ 
            "id": user.id, 
            "email": user.email, 
            "role": user.role 
        }, SECRET, { "expiresIn": "1h" });

       
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict', 
            maxAge: 3600000 
        });
        
        
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`); 
    }
);
router.use(AuthMiddleware);

router.get('/profile',(req, res)=>{
    res.json({"Message ":"Your Profile","User":req.user})
});

router.post('/logout',logout);


module.exports = router;
