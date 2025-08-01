const mongoose =  require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        trim:true,
    },
    lastName:{
         type: String,
        required:true,
        trim:true,
    },
    email:{
         type: String,
        required:true,
        trim:true,
    },
    password:{
         type: String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[
       {
         type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course",
       }
    ],
    image:{
        type:String,
        required:true,
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    courseProgess:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgess",
    }
    ],
    active:{
        type:Boolean,
        default:true,
    },
    approved:{
        type:Boolean,
        default:true,
    }
});
module.exports = mongoose.model("User",userSchema);
