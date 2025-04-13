const express=require("express");
const requestConnectionRouter=express.Router();
const User=require("../models/User");
const {userauth}=require("../middlewares/auth");
 const ConnectionRequest=require("../models/ConnectionRequest")
requestConnectionRouter.post(
    "/request/send/:status/:toUserId", 
    //yeh wali api tbb cahemgi jbb A interested ho B me but A ko login honaa chaiye pehle
    ///userId uski aayengi jisme hme interest hai
    userauth,
    async (req, res) => {
    try{
       
        const fromUserId=req.user._id; ///yeh wo user ki id hai jo request bhej rha hai kyukii
        //yeh userauth(middleware) se pass hokrrr aa rahi hai toh wo value  postman se aarhi hai wo ek loggedin user hai or wo request beh rhaa haii
        const toUserId=req.params.toUserId; //jisko request jaa rahii hai uski id yeh haii

       const status=req.params.status;

////saves the values of the senderid(fromuserId) and the toUserId(receiverid) and teh status
  const allowedtstatus=["ignored","interested"];
  if(!allowedtstatus.includes(status)){
    return res.status(400)
    .json({message:"invalid  inputs :" + status});
  }
  const toUser=await User.findById(toUserId);
  if(!toUser) ///jisko request bhejna chahe rahe hai wohi naa mile tbb
  {
     return res.status(404).json({message:" users is not found acatually with this id"});
  } 

  


///yhaa prr two edge cases hai
// 1)) agrr ek baar bhej di hai request then dubara se nhi bhej skte ho tumm

// 2)) agrr A ne B ko bhej di hai or pending hai then B A ko nhi behj skegaa or nahi A B ko bhej skengaa
const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
        { fromUserId: fromUserId, toUserId: toUserId },  // Check if A → B request exists
        { fromUserId: toUserId, toUserId: fromUserId }   // Check if B → A request exists
    ],
}); 
if(existingConnectionRequest){ 
    return res.status(400).send({message :"Users is already is existings"});
}
if (String(fromUserId) === String(toUserId)) { ///when the user send the requests to itself
    return res.status(404).json({ message: "User cannot send the request to itself" });
}






const ConnectionRequesting=new ConnectionRequest({
    // est is actually come from the connection request model in whcih we creaate teh senderid and the receiverid
    fromUserId,
    toUserId,
    status,

});
const data=await ConnectionRequesting.save();
res.json({
    message: req.user.firstName + " is " + status +  " in " +  toUser.firstName,
    data,
})
}

    catch(err)
    {
        res.status(400).send("the error is found:"+err.message);
    }
});
requestConnectionRouter.post("/request/review/:status/:requestId", userauth, async (req, res) => {
    try { 
        ///yeh wali tb hi chll rhi hai jb  A se B bhej rhe hai and B must be looged In hona cahiye
        //or wo pehle se A se B interested wali request jaa chuki hoo
        //or isme requestID inteested wali A TO B me  mongoose_id wali daalni haii
        const loggedIn = req.user;
        const { status, requestId } = req.params;
        // console.log(requestId);
        const isAllowed = ["accepted", "rejected"];

        if (!isAllowed.includes(status)) {
            return res.status(404).send("This status is not allowed");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId, 
            toUserId: loggedIn._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "This is not allowed" });
        }

     
        connectionRequest.status = status;
     await connectionRequest.save();

        return res.status(200).json({
            message: `Request has been ${status} successfully`,
           
        });
ss
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
});




module.exports=requestConnectionRouter;


