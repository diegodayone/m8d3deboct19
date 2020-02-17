const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const passport = require("passport")
const { superOnly } = require("./src/utils/auth")
const userRouter = require("./src/routes/users")
const settingsRouter = require("./src/routes/settings")

mongoose.connect("mongodb://127.0.0.1:27017/m8", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => console.log(err ? err : "Mongo Connected"))

const server = express();

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

server.use("/user", userRouter)
server.use("/settings", passport.authenticate("jwt"), superOnly, settingsRouter)
server.use("/", (req,res)=> res.send("Server is running!"))

server.listen(process.env.PORT || 3551, ()=> console.log("Web Server is running"))