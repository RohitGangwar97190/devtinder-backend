const express=require("express");

const {validateSignUpData}=require("../utils/validation")
const User=require("../models/User");
const authRouter=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
authRouter.post("/signup", async (req,res)=>{
   
    // creating the new instance of the user model
    // const user=new User({ ////yeh wala hmm POSTMAN API ke through de rhe haii
    //     firstName:"Rohit",
    //     lastName:"kurmi",
    //     emailId:"rohitgangwar971912@gmail.com",
    //     password:"rohit@97190"
    // });
    // try
    // {
    //     await user.save();
    //     res.send("user addedddeesdd sucessfully");
    // }  
    //  catch(err)
    //  {
    //     res.status(400).send("user not added",+err.message);
    // } 
    // 0R /// it is same 
     ///validate the data////
     try{
     validateSignUpData(req);
     const { firstName,
        lastName,
        emailId,password}=req.body;
        ///to check that account woth this  eemail is alaredy exist///
//      const existingUser = await User.findOne({ email: req.body.email });
//      if (existingUser) {
//     return res.status(400).json({ error: "Email already registered" });
// }

     //////encryptt the data////////
     const hashedPassword=await bcrypt.hash(password,10);
    //  console.log(hashedPassword);
   
     const user=new User({
        firstName,
        lastName,
        emailId,
        password:hashedPassword,
     })

     
     

    
        await user.save();
        res.send("user addedddeesdd sucessfully");
    }  
     catch(err)
     {
        res.status(400).send("Error :"+ err.message);

    } 
   
})

authRouter.post("/login",async(req,res)=>{
   
    try{
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId:emailId});
        
        if(!user){
            throw new Error("Invalid credentials and user not");
        }
        // const validPassword=await bcrypt.compare(password,user.password);
        ///another way to valiadte the password///
        const isPasswordValid=await user.validatepassword(password);
        if(isPasswordValid)
            
        { /////create the JWT token///////
        //  const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",
        //     {expiresIn:"30d"});
        //  console.log(token);
        ////another way to create the token bu ysing the mongoose schema///
        const token=await user.getJWT();

          ////Add the token to the cookies and send response to the user////
          res.cookie("token",token,
        //    { expires:new Date(Date.now()+8*360000)}
            ///set the cookies timings///
        );
           res.send("user login successfully");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
   
    catch(err)
    {
        res.status(400).send("ERROR :"+err.message);
    }
});

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        });
    res.send("user is successfullu logout");
})
module.exports=authRouter;