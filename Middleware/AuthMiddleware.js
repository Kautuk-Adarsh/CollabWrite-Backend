const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET;

const AuthMiddleware = (req, res, next)=>{

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({"Message":"No Token Provided"});
    }

    try{
        const decoded = jwt.verify(token , SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({"Message":"Invalid or expired Token "});
    }
}

module.exports = AuthMiddleware;