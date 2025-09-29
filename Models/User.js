const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    googleId:{type : String, required: true, unique: true , sparse: true},
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, {
    
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    }
});

module.exports = mongoose.model('User', UserSchema);
