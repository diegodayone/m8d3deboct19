const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    role: {
        type:String,
        required: true,
        default: "User"
    },
    facebookId: String
})

userSchema.plugin(plm)

module.exports = mongoose.model("m8d3UsersDebrief", userSchema)