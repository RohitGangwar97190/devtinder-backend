const jwt=require("jsonwebtoken");
const User=require("../models/User");
const userauth=async(req,res,next)=>{
    try{
    ////to get the token from the cookies
    const {token}=req.cookies;
    if(!token)
    {
        throw new Error("token is not found");
    }
    ///to validate the cookies
     const decodedObj=jwt.verify(token,"DEV@Tinder$790");
    const {_id}=decodedObj;
     //find the user
     const user=await User.findById(_id);
    if(!user)
    {
        throw new Error("User is not found");
    }
    req.user=user;
   
    next();

   
    }catch(err)
    {
        res.status(400).send("the user is not found:"+err.message);
    }
    


}
module.exports={
    userauth
}