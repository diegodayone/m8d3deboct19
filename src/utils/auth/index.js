const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const FbStrategy = require("passport-facebook-token")
const passport = require("passport")
const User = require("../../models/user")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

//How are we gonna serialize / deserialize the user?
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

passport.use(new LocalStrategy(User.authenticate()))

const password = process.env.JWT_PASS
const jwtConfig = { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: password }

passport.use(new JwtStrategy(jwtConfig,
    (jwtPayload, next) => {
        User.findById(jwtPayload._id, (err, user) => {
            if (err) return next(err, null)
            else if (user) return next(null, user)
            else return (null, false)
        })
    }))

passport.use("fb", new FbStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_KEY
}, async (accessToken, refreshToken, profile, next) => {
    try {
        const user = await User.findOne({ facebookdId: profile.id })
        if (user)
            next(null, user)
        else {
            const newUser = await User.create({
                facebookdId: profile.id,
                username: profile.id
            })
            next(null, newUser)
        }
    } catch (exx) {
        next(exx)
    }
}))


module.exports = {
    generateToken: userInfo => jwt.sign(userInfo, password, { expiresIn: 1000 }),
    superOnly: async (req, res, next) => {
        if (req.user.role === "SuperUser")
            next()
        else
            res.status(401).send("Only for SuperUser, sorry mate!")
    }
}