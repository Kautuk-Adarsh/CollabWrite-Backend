exports.isAdmin = (req, res, next)=>{
    if(req.user.role !=="admin"){
        return res.status(403).json({"Message":"You dont have the permission for this route"})
    }
    next();
};