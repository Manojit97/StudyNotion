import React from 'react'
 import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RiEditBoxLine } from "react-icons/ri"
import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
const MyProfile = () => {
    const {user} = useSelector((state)=> state.profile)
    const navigate = useNavigate();
    
  return (
    <>
    <h1 className="mb-14 text-3xl font-medium text-[#F1F2FF]">
      My Profile
    </h1>
    <div className="flex items-center justify-between rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-8 px-12">
      <div className="flex items-center gap-x-4">
        <img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[78px] rounded-full object-cover"
        />
        <div className="space-y-1">
          <p className="text-lg font-semibold text-[#F1F2FF]">
            {user?.firstName + " " + user?.lastName}
          </p>
          <p className="text-sm text-[#838894]">{user?.email}</p>
        </div>
      </div>
      <IconBtn
        text="Edit"
        onclick={() => {
          navigate("/dashboard/settings")
        }}
      >
        <RiEditBoxLine />
      </IconBtn>
    </div>
    <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-8 px-12">
      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-semibold text-[#F1F2FF]">About</p>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <p
        className={`${
          user?.additionalDetails?.about
            ? "text-[#F1F2FF]"
            : "text-[#6E727F]"
        } text-sm font-medium`}
      >
        {user?.additionalDetails?.about ?? "Write Something About Yourself"}
      </p>
    </div>
    <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[#2C333F] bg-[#161D29] p-8 px-12">
      <div className="flex w-full items-center justify-between">
        <p className="text-lg font-semibold text-[#F1F2FF]">
          Personal Details
        </p>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="flex max-w-[500px] justify-between">
        <div className="flex flex-col gap-y-5">
          <div>
            <p className="mb-2 text-sm text-[#424854]">First Name</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {user?.firstName}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm text-[#424854]">Email</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm text-[#424854]">Gender</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {user?.additionalDetails?.gender ?? "Add Gender"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-5">
          <div>
            <p className="mb-2 text-sm text-[#424854]">Last Name</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {user?.lastName}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm text-[#424854]">Phone Number</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm text-[#424854]">Date Of Birth</p>
            <p className="text-sm font-medium text-[#F1F2FF]">
              {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                "Add Date Of Birth"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default MyProfile