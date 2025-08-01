import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {GiNinjaStar} from "react-icons/gi"
import {RiDeleteBin6Line} from "react-icons/ri"

import { CiStar } from "react-icons/ci";
import { removeFromCart } from '../../../../reducer/slices/cartSlice'
import ReactStars from "react-rating-stars-component";
import GetAvgRating from '../../../../utils/avgRating';
import { FaStar } from "react-icons/fa"
const RenderCartCourses = () => {

    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const getRating = (course) => {
        const count = GetAvgRating(course?.ratingAndReviews);
         console.log("Course Name:", course?.courseName, "Calculated Rating:", count);
        return count;
      }

  return (
    <div className="flex flex-1 flex-col">
      {cart.map((course, indx) => (
        <div
          key={course._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            indx !== cart.length - 1 && "border-b border-b-[#6E727F] pb-6"
          } ${indx !== 0 && "mt-6"} `}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-[#F1F2FF]">
                {course?.courseName}
              </p>
              <p className="text-sm text-[#838894]">
                {course?.category?.name}
              </p>
              <div className="flex items-center gap-2">
              {/* {getRating(course)} */}
                <span className="text-[#FFF970]">4.5</span>
                <ReactStars
                  count={5}
                   value={getRating(course?.ratingAndReviews?.length)}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<CiStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-[#6E727F]">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className="flex items-center gap-x-1 rounded-md border border-[#424854]
               bg-[#2C333F] py-3 px-[12px] text-[#EF476F] cursor-pointer"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-[#E7C009]">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RenderCartCourses
