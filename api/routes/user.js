const express = require('express')
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../model/user");
const Post = require("../model/post");

//update

router.put("/:id",async(req,res)=>{
 
    if(req.body.userId===req.params.id){
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,10)
        }
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
             $set : req.body,
            },{new : true})
            res.status(200).json(updatedUser);
             
         }catch(err){
         
             console.log(err);
         }
    }else{
        res.status(401).json("user not found");
    }

   
})

//delete
router.delete("/:id",async(req,res)=>{
 
    if(req.body.userId===req.params.id){
       try{
        const user = await User.findById(req.params.id);
           try{
              
              await Post.deleteMany({username : user.username});
              await User.findByIdAndDelete(req.params.id);
               res.status(200).json("user has been deleted");
                
            }catch(err){
                console.log(err);
                res.status(500).json(err);
            }
           }
       
         catch(err){
         res.status(404).json("user not found!")
         }
    }else{
        res.status(401).json("You can delete only your account");
    }

   
})

//get

router.get("/:id",async(req,res)=>{

    try{

        const user = await User.findById(req.params.id);
        const{password,...others} = user._doc;
        res.status(201).json(others);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;
