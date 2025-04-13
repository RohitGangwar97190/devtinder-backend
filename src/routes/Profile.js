const express=require("express");
const profileRouter=express.Router();
const User=require("../models/User");
const {userauth}=require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
profileRouter.get("/profile/view",userauth,async (req,res)=>{
    try{
    // const cookies=req.cookies;
    // const {token}=cookies;
    // if(!token)
    // {
    //     throw new Error("there is a invalid token");
    // }
    ///validate the cookies////
    // const decodedMessage=await jwt.verify(token,"DEV@Tinder$790");
    //    console.log( decodedMessage);
    //    const {_id}=decodedMessage;
    //    console.log("the logged user is :"+_id);
    // console.log(cookies);
    // const user=await User.findById(_id);
    const user=req.user;
    // if(!user)
    // {
    //     throw new Error("Invalid user");
    // }

    res.send(user);
    }
    catch(err)
    {
        res.status(400).send("there isna error message:"+err.message);
    }
});
profileRouter.patch("/profile/edit",userauth,async(req,res)=>{
    try{
   if(!validateEditProfile(req)){
    throw new Error("somethings went wrongs");
   }
   const  loggedInuser=req.user;
//    console.log(loggedInuser);
   Object.keys(req.body).forEach((key)=>(loggedInuser[key]=req.body[key]));
    console.log(loggedInuser);
    // console.log("heloooo");
   res.send(`${loggedInuser.firstName} user edit is successful`);
   await loggedInuser.save();

    }
    
    catch(err)
    {
        res.status(400).send("there is an error message:"+err.message);
    }

})
module.exports=profileRouter;