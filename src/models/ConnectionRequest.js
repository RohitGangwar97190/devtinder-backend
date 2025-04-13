const mongoose=require("mongoose");
const connectionRequestSchema=mongoose.Schema({
    fromUserId:{ //jo request bhej rhaa hai connection bnane ke liyee uski id
        type:mongoose.Types.ObjectId,
        ref:"User", ///// refrencing to the User schemaa //// and User naame hai User.js model ka haii
        //basicalyy yhaa hprr ref User.js ko connect krr rha hai connectionRequestSchema seee
        required:true,
    },
    toUserId:{ ///jo accepts krengaa request koo uski id
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
   status:{
    type:String,
    enum:{
    values:[ ///enum is used when we want to apply some restrictions
    "ignored",
    "interested",
    "accepted",
    "rejected",
    ],
    message:`{VALUE} is not accepted heres`,
    required:true,
    },
   
    
   }
},
{
    timestamps:true,
}

);
connectionRequestSchema.index({fromUserId:1,toUserId:1});
connectionRequestSchema.pre("save", function (next) {  
    const connectionRequest = this;
    
    // Check if the user is sending the request to themselves
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(new Error("User cannot send the request to themselves"));
    }
    
    next();
});


const ConnectionRequest=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=ConnectionRequest;
