import React from 'react'
import { useLocation, useNavigate,  } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { VscSignOut } from "react-icons/vsc"
import SidebarLink from './SidebarLink'
import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import ConfirmationModal from '../../common/ConfirmationModal'
import { useState } from 'react'
const Sidebar = () => {

    const { user, loading: profileLoading } = useSelector(
        (state) => state.profile
      )
      const { loading: authLoading } = useSelector((state) => state.auth)
      const dispatch = useDispatch()
      const navigate = useNavigate()
      // to keep track of confirmation modal
      const [confirmationModal, setConfirmationModal] = useState(null)

      if (profileLoading || authLoading) {
        return (
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-[#2C333F] bg-[#161D29]">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <>
        <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-[#2C333F] bg-[#161D29] py-10'>
            <div className='flex flex-col'>
                {sidebarLinks.map((link)=>{
                        if (link.type && user?.accountType !== link.type) return null;
                        return <SidebarLink key={link.id} link={link} iconName = {link.icon}/>
                        })}
            </div>

            <div className="mx-auto mt-6 mb-6 h-[1px] w-9/12 bg-[#2C333F]" />

            <div className='flex flex-col'>
                <SidebarLink link={{name:"Settings", path:"/dashboard/settings"}} iconName="VscSettingsGear" />
                <button onClick={()=> {
                    setConfirmationModal({
                        text1: "Are you sure?",
                        text2: "You will be logged out of your account.",
                        btn1Text: "Logout",
                        btn2Text: "Cancel",
                        btn1Handler: ()=> dispatch(logout(navigate)),
                        btn2Handler: ()=> setConfirmationModal(null),
                    })
                }}
                className="px-8 py-2 text-sm font-medium text-[#838894]">
                    <div className="flex items-center gap-x-2 cursor-pointer">
                    <VscSignOut className="text-lg" />
                    <span>Logout</span>
                    </div>
                </button>
            </div>
        </div>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default Sidebar