const express = require('express');
const router = express.Router();
const user= require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authuser = require('../Middleware/authUser');


router.post('/register',async (req,res)=>{
     try {
      console.log("register");
         const {username,adharnum,password,role,isvoted} = req.body;
      if(!username || !adharnum || !password)
        {
            return res.status(400).send("All fields are required");
        }  
        console.log(2);
    
        const newuser = new user({username,adharnum,password,role,isvoted});

        const saveduser = await newuser.save();

        console.log(`User: ${saveduser}`);

        const token = jwt.sign({id:saveduser._id},process.env.SECRET,{expiresIn: '1h'});

        res.status(200).json({token});

     } catch (error) {
        res.status(500).send(error);
     }

      
});


router.post('/login',async(req,res)=>{
      try {
         const {adharnum,password} = req.body;
      if(!adharnum || !password)
        {
            return res.status(400).send("All fields are required");
        }  
    
        const User = await user.findOne({adharnum});
        if(!User)
        {
            return res.status(400).send("no usesrs found");
        }

        const isMatch = await bcrypt.compare(password,User.password);

        if(!isMatch)
        {
           return res.status(400).send("Invalid credentials");
        }

        const token = jwt.sign({id:User._id},process.env.SECRET,{expiresIn: '1h'});

        res.status(200).json({token});

     } catch (error) {
        res.status(400).send(error);
     }
});

router.get('/profile',authuser,async (req,res)=>{
   const Userid=req.user.id;
   // because user will contain decoded info which is an object as assigned when signing jwt in above format so req.user.id not just req.user 
   try {
      
      const curuser = await user.findById(Userid);
      
      res.status(200).json({curuser});
   } catch (error) {
      res.status(500).send(error);
   }

});

router.put('/profile/password',authuser,async(req,res)=>{
    const Userid=req.user.id;
    const {currentpassword,newpassword} = req.body;//extract old and new password from body
   try {
      const User = await user.findById(Userid);

      const isMatch = await bcrypt.compare(currentpassword,User.password);
      
      if(!isMatch)
         {
            return res.status(400).send("Invalid credentials");
         }
      
      User.password=newpassword;
      await User.save();
      
      res.status(200).json({message:"password updated"});
   } catch (error) {
      res.status(500).send(error);
   }
})




module.exports = router;