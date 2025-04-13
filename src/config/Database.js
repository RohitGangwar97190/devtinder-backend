const mongoose=require("mongoose");
const connectDB=async()=>{
await
mongoose.connect("mongodb+srv://abc11:abc11@cluster0.wd7yf.mongodb.net/devtinder");
}
///it return the promises
module.exports=connectDB;
