const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET;


exports.register = async(req, res)=>{
    try{
    const {username ,email,  password} = req.body ;

    
    if(!username || !password ||!email){
        return res.status(400).json({"status":"Failed", "Message":"All fields are required"});
    }
    
    
    
    let existingUser = await  User.findOne({email:email});
    if(existingUser){
       return  res.status(400).json({ "Message":"The user already Exists"});
    }

    
    const hashedPassword = await bcrypt.hash(password, 10); 

    
    
    const newUser = new User({username, email,password:hashedPassword});
    await newUser.save();
    res.status(200).json({ "Message":"Registration Sucessful ","UserId" : newUser.id,});
    }catch(err){
        console.error(err);
        res.status(500).json({"message":"Registration Failed"})
    }
    


};



exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ Message: "All fields are required" });
  }

  let user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    return res.status(401).json({ Message: "User not found" });
  }

  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(401).json({ Message: "Invalid Password" });
  }

  const token = jwt.sign({ "id": user.id, "email": user.email, "role": user.role }, SECRET, { "expiresIn": "1h" });

  
  res.cookie('token', token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    maxAge: 3600000 
  });

  
  res.status(200).json({
    Message: "Login Successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ "Message": "Logout Successful" });
};
