const express = require("express")
const User = require("../../models/user")

const router = express.Router()

router.get("/", async (req, res)=>{
      res.send("CONGRATS, you are a superuser!")
})

router.post("/makeSuper/:username", async (req, res) =>{
    await User.findOneAndUpdate({ username: req.params.username }, { role: "SuperUser"})
    res.send("Done!")
})

module.exports = router;