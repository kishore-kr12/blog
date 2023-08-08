const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../model/user");

//regiter

router.post("/register",async(req,res)=>{
    try{
      
        const hashPassword = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashPassword

        });
        const user = await newUser.save(); 
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
})

// login

router.post("/login",async(req,res)=>{
    try{

        const user = await User.findOne({username:req.body.username});
        !user && res.status(400).json("wrong credientials");
        const validated = await bcrypt.compare(req.body.password,user.password);
        !validated && res.status(400).json("wrong credientials ");
        const{password , ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;