
const RatingAndReview = require("../models/RatingAndReview.jsx");
const Course = require("../models/Course.jsx");
const { default: mongoose } = require("mongoose");


// create Rating
exports.createRating = async (req, res)=>{
    try{
        // get user ID
        const userId = req.user.id;
        // fetch data from req body
        const {rating, review, courseId} = req.body;
        // check if user is enrolled or not 
       // Correct usage
       const courseDetails = await Course.findOne(
          {
               _id: courseId,
               studentsEnrolled: userId, // This directly checks if userId exists in the studentsEnrolled array
           }
               );
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course",
            });
        }

        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                    user:userId,
                                                    course:courseId,
        });

        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }

        // create rating and review
        const ratingReview = await RatingAndReview.create({
                                        rating, review,
                                        course:courseId,
                                        user:userId
        });

        // update course with this rating/review
        const updateCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                                                    {
                                                                        $push:{
                                                                            ratingAndReviews:ratingReview._id,
                                                                        }
                                                                    },
                                                                    {new:true});
        console.log(updateCourseDetails);
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message
        });
    }
}


// get average rating
exports.getAverageRating = async (req, res)=>{
    try{
        // get course ID
        const courseId = req.body.courseId;
        // calculate avg rating

        const result = await RatingAndReview.aggregate([
                            {
                                $match:{
                                    course:new mongoose.Types.ObjectId(courseId),
                                },
                            },
                            {
                                $group:{
                                    _id:null,
                                    averageRating: {$avg: "$rating"},
                                }
                            }
        ])

        // return rating
        if(result.length >0){
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }
        // if no rating / review exists
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating given till now",
            averageRating:0,
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}


// get all rating and reviews
exports.getAllRating = async (req, res)=>{
    try{
        const allReviews = await RatingAndReview.find({})
                                                .sort({rating:"desc"})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image", 
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName",
                                                })
                                                .exec();
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}
