const validator=require("validator");
const validateSignUpData=(req)=>{
    const{firstName,lastName,emailId,password}=req.body;
    if(!firstName||!lastName)
    {
        throw new Error("something is wrongs");
        
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email id is not valid");
        
    }
    // else if(!validator.isStrongPassword(password))
    // {
    //     throw new Error("password is not strong");
    // }
    

};
const validateEditProfile=(req)=>{
    const validprofiledata=[
        "firstName",
        "lastName",
        "emailId",
        "skills",
        "gender",
        "photoUrl",
        "age"
    ]
    const isallowededit=Object.keys(req.body).every((fields)=>
        //req.body yeh btaa rhaaa hai ki jo values postman api ke throgh aa rhi hai unko hi cinsidered krnaa haii

        validprofiledata.includes(fields) //yeh btaa rhaa haii ki wohi values leni hai upr defined haii
        
    );
    return isallowededit; 
    }


module.exports = {
    validateSignUpData,validateEditProfile
};