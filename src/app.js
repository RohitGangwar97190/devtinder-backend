// const express=require("express"); 
// //import the express from the nodemodules///
// const app=express();
// we craete the app
// // app.use("/",(req,res) =>{
// //     res.send("hello from the server world helloooo which is very vast and large");
// // }) 
// app.get("/user",(req,res)=>{
//     res.send({"firstname":"Rohit","lastname":"Rohit"})
// });
// ////This app.use is worked same to all the HTTPS methis means we can get,post get the same data 
// app.use("/test",(req,res) =>{
//     res.send("hello from the server world");
//  }) 
// // app.use("/hello",(req,res) =>{
// //     res.send("hello hello hello");
// // }) 

// ///this function is a request handler/////
// app.listen(3000,()=>{
//     console.log("server is running on port no which is 3000");
// })
// //in this we create our own server whcih is listen on the port no 3000///// 
//////////**************lec-05****************/// */
// const express=require("express");
// const app=express();
// app.use("/user",(req,res,next)=>{
//      next();
//      res.send("hello this side Rohit-1"); ///agr isko comment out krde phir res.send2 nhi cahlegaa or rendering krta rahegaa then yhaa pr middleware next() ka concept aaya hai isko hi middleware bolte haii
   
// },(req,res,next)=>{
//     next();
//      res.send("hello this side rohit2");
    
// },(req,res)=>{
//     next();
//     res.send("hello this side rohit3")
// });
// app.listen(3000,()=>{
//     console.log("server is running on port no which is 3000");
// })
//////*****Reasons to be sued the middlewares************* *//////
// const express=require("express");
// const {adminAuth}=require("./middlewares/auth")
// const app=express();
// app.use("/admin",adminAuth)
// app.get("/admin/getuserdata",(req,res)=>{
//     res.send("get all the user data");
// });
// app.get("/admin/getdeletedata",(req,res)=>{
//     res.send("get all the delete data");
// });
// app.listen(3000,()=>{
//     console.log("server is running on port no which is 3000");
// })
const express = require("express");
const app = express();
const connectDB = require("./config/Database");
const User = require('./models/User');
const{validateSignUpData}=require("./utils/validation")
app.use(express.json()) ;
const bcrypt=require("bcrypt");
const cookiesParser=require("cookie-parser");
app.use(cookiesParser());
const jwt=require("jsonwebtoken");
const {userauth}=require("./middlewares/auth")
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/Profile");
const requestConnectionRouter = require("./routes/requests");
const userRouter = require("./routes/user");
app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestConnectionRouter);
app.use('/',userRouter);

///To get the data 
// app.get("/user",async (req,res)=>{
//     const userEmail=req.body.emailId;
//     try{
//        const user= await User.findOne({emailId:userEmail});
//        res.send(user)

//     }catch(Err){
//         res.status(400).send("something went wrong");
//     }
   
// })
//To post the data

//   app.post("/signup", async (req,res)=>{
   
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
//      try{
//      validateSignUpData(req);
//      const { firstName,
//         lastName,
//         emailId,password}=req.body;
//      ////encryptt the data////////
//      const hashedPassword=await bcrypt.hash(password,10);
//      console.log(hashedPassword);
   
//      const user=new User({
//         firstName,
//         lastName,
//         emailId,
//         password:hashedPassword,
//      })

     
     

    
//         await user.save();
//         res.send("user addedddeesdd sucessfully");
//     }  
//      catch(err)
//      {
//         res.status(400).send("Error :"+ err.message);

//     } 
   
// })

//////////login API/////////
// app.post("/login",async(req,res)=>{
//     try{
//         const {emailId,password}=req.body;
//         const user=await User.findOne({emailId:emailId});
//         if(!user){
//             throw new Error("Invalid credentials");
//         }
        // const validPassword=await bcrypt.compare(password,user.password);
        ///another way to valiadte the password///
        // const isPassordValid=await user.validatepassword(password); //yeh mongoose schenm wale methods haii jo schema ke ander concept likhgee ab wohi hi sbkuch handle kr lingee
        // if(isPassordValid)
        // { /////create the JWT token///////
        //  const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",
        //     {expiresIn:"30d"});
        //  console.log(token);
        ////another way to create the token bu ysing the mongoose schema///
        // const token=await user.getJWT(); ///iski values sbkuch schemaa se a rhiii 

          ////Add the token to the cookies and send response to the user////
//           res.cookie("token",token,
//            { expires:new Date(Date.now()+8*360000)}
//             ///set the cookies timings///
//         );
//            res.send("user login successfully");
//         }
//         else{
//             throw new Error("Invalid Credentials");
//         }
//     }
//     catch(err)
//     {
//         res.status(400).send("ERROR :"+err.message);
//     }
// });
// //to get the profile///
// app.get("/profile",userauth,async (req,res)=>{
//     try{
//     const cookies=req.cookies;
//     const {token}=cookies;
//     if(!token)
//     {
//         throw new Error("there is a invalid token");
//     }
//     /validate the cookies////
//     const decodedMessage=await jwt.verify(token,"DEV@Tinder$790");
//        console.log( decodedMessage);
//        const {_id}=decodedMessage;
//        console.log("the logged user is :"+_id);
//     console.log(cookies);
//     const user=await User.findById(_id);
    
//     if(!user)
//     {
//         throw new Error("Invalid user");
//     }

//     res.send(user);
//     }
//     catch(err)
//     {
//         res.status(400).send("there isna error message:"+err.message);
//     }
// });
//  app.post("/sendconnectionRequest",userauth,async(req,res,next)=>{
//     try{
//         const user=req.user; ///jo user login honga uske name se request send hongiii cookies me jaakr dekh lo kon login haiii
//         console.log("connectionj of the sending request is accept");
//         res.send(user.firstName+" is sending the request");
//     }catch(err)
//     {
//         res.status(400).send("the error is found:"+err.message);
//     }
// })
// ///To delete the data
// app.delete("/user",async (req,res)=>{
//     const userId=req.body._id;
//     try{
//     // const user=User.findByIdAndDelete(userId);
//     const user=await User.findByIdAndDelete({_id:userId});
//     console.log(user);
    
//     res.send("delete sucessfullyy");


//     }catch(err){
//         res.status(400).send("something went wrongs");
//     }
// })
// //To updates
// app.patch("/user", async (req, res) => {
//     const userId = req.body.userId;
//     const data = req.body;

//     try {
//         const Allowed_updtes = [
//             "userId",
//             "firstName",
//             "lastName",
//             "skills",
//             // "gender",
//             // "photourl",
//         ];

//         // Validate fields in data
//         const isallowed_updates = Object.keys(data).every((k) =>
//             Allowed_updtes.includes(k)
//         );

//         if (!isallowed_updates) {
//             throw new Error("Some fields are not allowed to be updated.");
//         }

//         // Validate skills length
//         if (data.skills && data.skills.length > 10) {
//             return res.status(400).send("Skills length must not exceed 10.");
//         }

//         // Update user
//         const user = await User.findByIdAndUpdate(userId, data, { new: true });
//         if (!user) {
//             throw new Error("User not found.");
//         }

//         console.log(user);
//         res.send("User data was successfully updated.");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send(`Error: ${err.message}`);
//     }
// });

connectDB()
    .then(() => {
        console.log("Database is connected");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
       })
    .catch((err) => {
        console.log("Database connection failed", err);
    });
    
