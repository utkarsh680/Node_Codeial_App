const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

// JWT options
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'codeial' // Replace with your actual secret key
};

// Configure Passport to use JWT strategy
passport.use(new JWTStrategy(opts, async function(jwtPayload, done) {
    try {
        // Find user by ID in JWT payload
        const user = await User.findById(jwtPayload._id);
        
        if (user) {
            // User found, authentication successful
            return done(null, user);
        } else {
            // User not found
            return done(null, false);
        }
    } catch (err) {
        // Error finding user
        console.error('Error finding user in JWT:', err);
        return done(err, false);
    }
}));

module.exports = passport;