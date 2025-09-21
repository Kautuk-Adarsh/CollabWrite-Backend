const {validationResult} = require('express-validator')

exports.validate = (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            "status":"False",
            "Errors":errors.array().map(err => ({
                "Field": err.Param,
                "Message": err.msg
            }))
        })
    }
    next();
}