import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import IconBtn from '../../../common/IconBtn';


import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

const RenderTotalAmount = () => {

    const {total, cart} = useSelector((state) => state.cart);
    
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch)
    }
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-6">
      <p className="mb-1 text-sm font-medium text-[#838894]">Total:</p>
      <p className="mb-6 text-3xl font-medium text-[#E7C009]">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center cursor pointer transition-all duration-200 hover:scale-95"
      />
    </div>
  )
}

export default RenderTotalAmount
