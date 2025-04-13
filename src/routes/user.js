const express=require("express");
const { userauth } = require("../middlewares/auth");
const userRouter=express.Router();
const ConnectionRequesting=require("../models/ConnectionRequest");
const User=require("../models/User");

////it is defined the no of pending requsts  for the  loggedIn user////
//isee chalna pehle padengaa /usrs/connection wali se kyuki isme hmm jo pendings hai usko accept 
//krr rhe hai
userRouter.get("/user/requests/received",userauth,async(req,res)=>{ 
    
    try{
        const loggedIn=req.user;
        ///jo user logged hai usprr kitni requests aayi haii
        ///// iska login hona hai zarurii haii
        const connectionRequest= await ConnectionRequesting.find({
            toUserId:loggedIn._id,
            status:"interested",
            //mtlb jinhon erequest bhejii hai wo abhi acepts nhi hui hai
            //and bhejne wala interestd hai  
            ///or///
            // 🧠 In Your Case:
// You have a ConnectionRequest schema.

// Inside it, you have a field called fromUserId.

// That field is not just any value — it stores the ObjectId of a user from the User collection (your User.js model).

// ✅ So ref: "User" means:
// "This fromUserId points to a document in the User collection."
           
           
        }).populate("fromUserId",["firstName","lastName"]);
        res.status(200).json({
            message:"data fetched successfulyy ",
            data:connectionRequest,
        }) 
        ///.populate is used to fetch the full information when we required just only with the userid 


    }
   
    catch(err)
    {
res.status(400).send("ERROR  " +err.message)
    }
    

})
///this api will give the connections information that kon kon connected hai tumse uska data
//mil jayegaa hmee
///isko chalnae se pehle hme jo interested hai usko login krma hongaa or phir hme /user/requests/received"
//yeh wali api run krni hongi then last me hmm /user/connectuins wali cahelmge phir hme dikh jaygeaa data me
// userRouter.get("/user/connections",userauth,async(req,res)=>{
//     try{
//         const loggedIn=req.user;
//         const connectionRequest= await ConnectionRequesting.find({
//             $or:[
//                 {fromUserId:loggedIn._id,status:"accepted"},
//                 {toUserId:loggedIn._id,status:"accepted"},

//             ],
//         }).populate("fromUserId",["firstName","lastName"])
//            .populate("toUserId",["firstName","lastName"]);
//         const data=connectionRequest.map((row)=>row.fromUserId);
          
//         res.status(200).json({
//             message:"data fetched successfulyy in the connection api ",
//             connectionRequest,
//         })

//     }
    
//     catch(err)
//     {
//         res.status(400).json({
//             message: " somethings is wrongs in the connection api"
//         })
//     }
// })
userRouter.get("/user/connections", userauth, async (req, res) => { 
    //this api is used for finding the no of connections after accepting the  requests
    try {
        const loggedIn = req.user;

        const connectionRequest = await ConnectionRequesting.find({
            $or: [
                { fromUserId: loggedIn._id, status: "accepted" },
                { toUserId: loggedIn._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", ["_id", "firstName", "lastName"])
        .populate("toUserId", ["_id", "firstName", "lastName"]);

        // console.log("Fetched Connections:", connectionRequest);

        const data = connectionRequest.map((row) => {
            if (row.fromUserId && row.fromUserId._id.toString() === loggedIn._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.status(200).json({
            message: "Data fetched successfully in the connection API",
            connectionRequest,
            data,
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: "Something is wrong in the connection API"
        });
    }
});
// userRouter.get("/user/feed",userauth,async(req,res)=>{
//     try{
//         //kis kis ka card nhi deikhega jbb koi new user platform prr aayega tbb
//         ///1))khud ka nhi dikhegaa
//         ///2))jisko wo reject kr chuka hai
//         ///3))jisko wo request bhej  chuka hai
//         ///4))jiske saath wo connection me hai already
//         const loggedInUser=req.user;
//         //find all the conections(sent+receied)
//         const connectionRequests=await ConnectionRequesting.find({
//             $or:[
//                 {fromUserId:loggedInUser._id},
//                 { toUserId:loggedInUser._id}
//             ] //in this case jo loggedIn user hai wo sender bhi hoskta hai or receiver bhi ho skta hai
//             //loggedInuser wo hai jo postman ke throgh khud ko login kraa huaa ho
//         }).select("fromUserId toUserId");
       
//         const hideUserFromFeed=new Set(); ///we create the set data structure because it doesnot stores the
//         //dupliacte values of the same data 
//         connectionRequests.forEach(req =>{
//         hideUserFromFeed.add(req.fromUserId.toString());
//         hideUserFromFeed.add(req.toUserId.toString());
//         }); //iske through hmm wo log find krr rhe hai jinhe hmee hide krna or jiski hme dekhna nhi hai id
//         ///kyuki yeh log pehle se kisi na kisi cheez ke though conncet haii
//         const users=await User.find({
//             $and:[
//            { _id:{$nin:Array.from(hideUserFromFeed)}}, //here nin means hot in this arrays
//            { _id:{$ne:loggedInUser._id}}, //here ne means not equal to the loggedInUser menas khud ka card naa ho
//             ]//iske through hmm wo log ko find kr rhe hai database se jinki id hideUserFeed me nhi ho
          

//         }).select(USER_SAFE_DATA);

//          res.send(users);
//     } 
//     catch(err)
//     {
//         res.status(400).json("not found");
//     }
// })
const USER_SAFE_DATA = "_id firstName lastName emailId";

userRouter.get("/user/feed", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page=parseInt(req.query.limit)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50 ? 50:limit;

        if (!loggedInUser || !loggedInUser._id) {
            return res.status(401).json({ error: "Unauthorized: No user in request" });
        }

        

        // Step 1: Find all connection requests involving this user (sent or received)
        const connectionRequests = await ConnectionRequesting.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        

        // Step 2: Create a Set of user IDs to hide from feed
        const hideUserFromFeed = new Set();

        connectionRequests.forEach(request => {
            hideUserFromFeed.add(request.fromUserId.toString());
            hideUserFromFeed.add(request.toUserId.toString());
        });

        // Add own ID so user doesn’t see themselves
        hideUserFromFeed.add(loggedInUser._id.toString());

       

        // Step 3: Fetch users who are not in the hidden set
        const users = await User.find({
            _id: {
                $nin: Array.from(hideUserFromFeed)
            }
        }).select(USER_SAFE_DATA).skip((page-1)*10).limit(limit);

       

        res.status(200).json({data:users});
    } catch (err) {
   
        res.status(500).json({ error: err.message });
    }
});


module.exports=userRouter;