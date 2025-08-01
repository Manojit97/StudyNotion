
const User = require("../models/User.jsx");

const OTP = require("../models/Otp.jsx");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile.jsx");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require("dotenv").config();
const mailSender = require("../utils/mailSender.jsx");
const {passwordUpdated} = require("../mail/templates/passwordUpdate.jsx");

// send OTP
exports.sendOTP = async(req,res) =>{
    try{
            // fetch email from request body
    const {email} = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({email});

    // if user already exixts , then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"User already registered",
        })
    }

    // generate OTP 
    let otp = otpGenerator.generate(6, {
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP generated ", otp);

    // check unique otp or not
    let result = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator.generate(6,{
             upperCaseAlphabets:false,
             lowerCaseAlphabets:false,
             specialChars:false,
        });
        result = await OTP.findOne({otp:otp});
    }
   
    const otpPayload = {email, otp};
 // create an entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return response successful 
    res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",
        otp,
    })
 }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        });
    }
}


// SignUp
exports.signUp = async (req, res)=>{
    try{
          // data fetch from request body
          const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
          } = req.body;

          // validate those in some conditions
          if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are Required"
            })
          }

          // check password match
          if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword Value does not match, Please try again"
            });
          }

          // check user already exists or not
          const existingUser = await User.findOne({email});
          if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is Already registered",
            });
          }

          // find most recent OTP stored for the user
          const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
          console.log(recentOtp);
          // validate OTP 
          if(recentOtp.length == 0){
            // OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not found",
            })
          }else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
          }

          // hash password 
          const hashedPassword = await bcrypt.hash(password, 10);

          // entry create at DB

          const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
          });

          const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
          })

          // return res
          return res.status(200).json({
            success:true,
            message:"User is Registered Successfully",
            user,
          });
    }
    catch(err){
         console.log(err);
         return res.status(500).json({
            success:false,
            message:"User cannot be registered , please try again ",
         });
    }
}


// login
exports.login = async (req, res) =>{
    try{
          // get data from req body
          const {email,  password} = req.body;
          // validate data
          if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required , please try again",
            });
          }

          // user check exists or not 
          const user = await User.findOne({email}).populate("additionalDetails").exec();
          if(!user){
            return res.status(401).json({
                success:false,
                message:"User not registered , please signUp first",
            });
          }

          // generate jwt , after password matching
          if(await bcrypt.compare(password, user.password)){
            const payload = {
                email:user.email,
                id: user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"168h",
            });
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 7*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully...",
            })
          }
          else{
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect"
            })
          }
    }
    catch(err){
           console.log(err);
           return res.status(500).json({
            success:false,
            message:"Login Failure, Please try again"
           })
    }
}

// change password

exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword , confirmNewPassword} = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} 
  catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};