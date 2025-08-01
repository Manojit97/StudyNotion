import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { buyCourse } from '../services/operations/studentFeaturesAPI.jsx';

import { fetchCourseDetails } from '../services/operations/courseDetailsAPI.jsx';
import { setCourse } from '../reducer/slices/courseSlice.jsx';
import GetAvgRating from '../utils/avgRating.jsx';
import Error from "./Error.jsx"
import ConfirmationModal from "../components/common/ConfirmationModal.jsx"
import RatingStars from "../components/common/RatingStars.jsx"
import { formatDate } from '../services/formatDate.jsx';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { BsGlobe } from 'react-icons/bs';
import { BiVideo } from 'react-icons/bi';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard.jsx';
import { toast } from 'react-hot-toast';
import Footer from '../components/common/Footer.jsx'
import { addToCart } from '../reducer/slices/cartSlice.jsx';
import { ACCOUNT_TYPE } from '../utils/constants.jsx';
 
const CourseDetails = () => {
    const {token} = useSelector((state)=> state.auth)
    const {user} = useSelector((state) => state.profile )
    const {loading} = useSelector((state) => state.profile);
    const { cart } = useSelector((state) => state.cart)
    const {courseId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null)
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
      const getCourseFullDetails = async() => {
        try {
            const result = await fetchCourseDetails(courseId);
            console.log("Data", result)
                setCourseData(result);
        } catch (error) {
            toast.error("Could not get course")
            console.log("Could not fetch coursse details");
        }
      }

      getCourseFullDetails();
    }, [courseId])
    
   useEffect(() => {
    if (courseData?.data?.[0]?.ratingAndReviews) {
        const count = GetAvgRating(courseData.data[0].ratingAndReviews);
        setAvgReviewCount(count);
    }
}, [courseData])

    
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
   useEffect(() => {
    let lectures = 0;
    
    courseData?.data?.[0]?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length || 0;
    });
    setTotalNoOfLectures(lectures);
}, [courseData]);
    //Will store sectionIds for enabling the dropdown
    const [isActive, setIsActive] = useState([]);
    const handleActive = (id)=> {
        setIsActive(
            !isActive.includes(id) ? isActive.concat(id) : isActive.filter((e)=> e != id)
        )
    }

    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate,dispatch);
            return;
        }
        setConfirmationModal({
            text1:"you are not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }

     const handleAddToCart = () => {
            if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                toast.error("Instructor cannot buy the course")
                return
            }
            if (token) {
                // console.log("dispatching add to cart")
                dispatch(addToCart(courseData?.data?.[0]));
                // console.log("CART IN SLICE IS", cart)
                return;
            }
            setConfirmationModal({
                text1:"you are not logged in",
                text2:"Please login to add to cart",
                btn1Text:"login",
                btn2Text:"cancel",
                btn1Handler:()=>navigate("/login"),
                btn2Handler: ()=> setConfirmationModal(null),
            })
        }

    if(loading || !courseData) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    if(!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        )
    }
     
    const {
        _id: course_id,
        courseName,
         courseDescription: description,
        thumbnail,
        price, 
       whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData.data[0];
     
  return (
    <>
        {/* Details and Course Buy Card */}
        <div className='relative w-full bg-[#161D29]'>
            <div className='mx-auto box-content px-4 lg:w-[1260px] 2xl:relative '>
                <div className='mx-auto grid min-h-[450px] max-w-[1280px] justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>
                   
                   <div className='relative block max-h-[30rem] lg:hidden'>
                        <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'>
                        </div>
                        <img src={thumbnail} className='aspect-auto w-full'/>
                   </div>

                   <div className='z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-[#F1F2FF]'>
                        <p className='text-4xl font-bold text-[#F1F2FF] sm:text-[42px]'>{courseName}</p>
                        <p className='text-[#999DAA]'>{description}</p>
                        
                        <div className='text-md flex flex-wrap items-center gap-2'>
                            <span className='text-[#FFE83D]'>{avgReviewCount}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                            <span>{`(${ratingAndReviews.length} reviews) `}</span>
                            <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
                        </div>

                        <div>
                            <p>Created By {`${instructor.firstName}`}</p>
                        </div>

                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className='flex items-center gap-2'>
                            <i className=' text-white'><IoIosInformationCircleOutline/></i>
                                Created At {formatDate(createdAt)}
                            </p>
                            <p className='flex items-center gap-2'>
                            <BsGlobe/>
                                {" "} English
                            </p>
                        </div>
                   </div>
                   
                   <div className='flex w-full flex-col gap-4 border-y border-y-[#585D69] py-4 lg:hidden'>
                        <p className='space-x-3 pb-4 text-3xl font-semibold text-[#F1F2FF]'>
                            Rs. {price}
                        </p>

                        <button onClick={handleBuyCourse}
                        className='cursor-pointer rounded-md bg-[#FFD60A] px-[20px] py-[8px] font-semibold text-[#000814] transition-all duration-200 hover:scale-95'>Buy Now </button>
                        <button onClick={() => handleAddToCart(courseData.data[0])}
                        className='  cursor-pointer rounded-md bg-[#014A32] px-[20px]py-[8px] font-semibold text-[#F1F2FF]  hover:text-green-300 transition-all duration-200 hover:scale-95'>Add to Cart
                             
                        </button>
                   </div>
                    
                </div>
                
                <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block'>
               <CourseDetailsCard
                  course = {courseData?.data?.[0]} // Pass the first element of the array
                  setConfirmationModal = {setConfirmationModal}
                 handleBuyCourse = {handleBuyCourse}
                  />
                </div>
            </div>
        </div>

        {/* What will you learn, Course Content, Sections dropdown, Author */}
        <div className='mx-auto box-content px-4 text-start text-[#F1F2FF] lg:w-[1260px]'>
            <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]'>
                <div className='my-8 border border-[#424854] p-8'>
                <p className='text-3xl font-semibold'> What You WIll learn</p>
                <div className='mt-5'>
                    {whatYouWillLearn}
                </div>
                </div>
            
                <div className='max-w-[830px] '>

                    <div className='flex flex-col gap-3'>
                        <p className='text-[28px] font-semibold'>Course Content:</p>
                        
                            <div className='flex flex-wrap justify-between gap-2'>
                                <div className='flex gap-2'>
                                <span>{courseContent.length} section(s)</span>

                                
                                <span>
                                        {totalNoOfLectures} lectures
                                    </span>
                                    <span>
                                       {isNaN(courseData.data?.[0]?.totalDuration) ? "N/A" : courseData.data[0].totalDuration}
                                    </span>
                                </div>
                                <div>
                                    <button
                                        className='text-[#FFE83D]'
                                        onClick={() => setIsActive([])}>
                                        Collapse all Sections
                                    </button>
                                </div>
                            </div>
                        
                    </div>

                    <div className='py-4'>
                        {
                            courseContent.map((section) => (
                                <div key={section._id} className='overflow-hidden border border-solid border-[#424854] bg-[#2C333F] text-[#F1F2FF] last:mb-0'>
                                    {/* Section */}
                                    <div onClick={()=> handleActive(section._id)}>
                                        <div className='flex cursor-pointer items-start justify-between bg-opacity-20 px-7  py-6 transition-[0.3s]'>
                                            <div className='flex items-center gap-2'>
                                                {isActive.includes(section._id)? (<i className=' -rotate-90'><MdOutlineArrowForwardIos/></i>) : (<i className=' rotate-90'><MdOutlineArrowForwardIos/></i>)}
                                                <p>{section.sectionName}</p>
                                            </div>

                                            <div className=' space-x-4'>
                                                <span className=' text-[#FFE83D]'> {`${section.subSection.length} lecture(s)`} </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SubSections */}
                                    <div className={` ${isActive.includes(section._id) ? 'h-[88px]' : ''} relative h-0 overflow-hidden bg-[#000814] transition-[height] duration-[0.35s] ease-[ease]`}>
                                        {section.subSection.map((subSection)=> (
                                                <div key={subSection._id} className='text-textHead flex flex-col gap-2 px-7 py-6 font-semibold'>
                                                    <div className='py-2 flex justify-start items-center gap-2'>
                                                        <span>
                                                            <BiVideo/>
                                                        </span>
                                                        <p>
                                                            {subSection.title}
                                                        </p>
                                                    </div>
                                                </div>
                                        ))}
                                    </div>
                                    
                                </div>
                            ) )
                        }
                    </div>

                    <div className='mb-12 py-4'>
                        <p className="text-[28px] font-semibold">Author</p>
                        <div className=' flex items-center gap-4 py-4'>
                            <img className='h-14 w-14 rounded-full object-cover' src={instructor.image}/>
                            <p className='text-lg'>{instructor.firstName} {instructor.lastName}  </p>
                        </div>
                        <p className='text-lg'>
                                {instructor.additionalDetails.about}
                            </p>
                    </div>
                </div>
            </div>
        </div>
        
        <Footer/>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default CourseDetails