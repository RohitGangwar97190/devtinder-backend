const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        

        required:true,
    },
    lastName:{
        type:String,
        required:true,

    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        index:true,
        lowercase:true,
        trim:true,
        validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Invalid Email")
        };
    }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].include(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    about:{
        type:String,
        default:"this is a basically the short description",
    },
    skills:{
        type:[String],
        default:"this is a basically skill area",
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL of the photo");
            };
        }
    },
  


},
{
    timestamps:true
})
userSchema.methods.getJWT=async function(){
    const user=this;
    const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",{
        expiresIn:"7d",
    });
return token;
}
userSchema.methods.validatepassword=async function (passwordInputUser){
    const user=this;
    const hashedPassword=user.password;
    const isPasswordValid=await bcrypt.compare(
        passwordInputUser,
        hashedPassword
    )
return isPasswordValid;
}

module.exports =mongoose.model("User",userSchema);
