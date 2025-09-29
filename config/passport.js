const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User'); 

passport.serializeUser((user, done) => {
    done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});



passport.use(new GoogleStrategy({
    
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
    

    try {
       
        let user = await User.findOne({ 
            $or: [
                { googleId: profile.id },
                { email: profile.emails[0].value } 
            ] 
        });

        if (user) {
            
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            
            return done(null, user); 
            
        } else {
           
            const newUser = new User({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
              
            });

            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        console.error("Passport Google Strategy Error:", err);
        return done(err, null);
    }
}
));

module.exports = passport;