const express = require("express")
const User = require("../../models/user")
const passport = require("passport")
const { generateToken } = require("../../utils/auth")
const router = express.Router()

router.get("/", async (req, res)=>{
    //console.log(req.user)
    res.send(await User.find())
})

//no passport here, just new user creation
router.post("/register", async(req, res) => {
    try{
        delete req.body.role
        const newUser = await User.register(req.body, req.body.password)
        res.send(newUser)
    }
    catch(exx){
        console.log(exx)
        res.status(500).send(exx)
    }
})

// passport local ==> requires username and password in the body
router.post("/login", passport.authenticate("local"), async(req, res)=>{
    const token = generateToken({ _id: req.user._id, username: req.user.username })
    res.send({
        access_token: token,
        username: req.user.username
    })
})

// passport jwt ==> require Authorization: Bearer jtwtoken
router.post("/refresh", passport.authenticate("jwt"), async(req,res)=>{
    const token = generateToken({ _id: req.user._id, username: req.user.username })
    res.send({
        access_token: token,
        username: req.user.username
    })
})


module.exports = router;