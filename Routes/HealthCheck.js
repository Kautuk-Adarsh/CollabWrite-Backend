const express = require('express')
const router = express.Router();

router.get('/health',(req, res)=>{
    return res.json({"status": "OK", "message":"Everything is fine"});
})

module.exports = router;