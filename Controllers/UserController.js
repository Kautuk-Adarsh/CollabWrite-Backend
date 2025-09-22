const User = require('../Models/User')
const bcrypt =  require("bcrypt")

exports.UpdateUser = async (req,res)=>{
    try{
    const { email, password, username } = req.body;
    let user = await User.findById(req.user.id);

    if(!user){
        return res.status(404).json({"Message":"Cannot find the user"});
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }
    await user.save();
    res.status(200).json({ message: "Profile updated", user });
    }catch(err){
        console.error(err)
        return res.status(500).json({"Message":"Updation of the user profile failed"});
    }
}

exports.DeleteUser = async (req, res)=>{
    try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting account" });
  }
}

exports.GetUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.AdminDeleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted by admin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } }
      ]
    }).select("id username email");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error searching for users" });
  }
};

exports.getMe = async (req, res) => {
    try {
        // req.user.id is attached by the AuthMiddleware
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        res.status(200).json({ user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
