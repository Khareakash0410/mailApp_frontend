import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserSuccess, logoutSuccess, updateProfilePic, updateUserName } from '../store/slice/UserSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingButton from './LoadingButton';
import { Button, Modal } from 'antd';


const NavbarWithSidebar = () => {
    
    let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

    const User = useSelector((state) => state.user);
    
    let nameRef = useRef();
    let passwordRef = useRef();

    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isePasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const dispatch = useDispatch();

    const [showLoadingButton, setShowLoadingButton] = useState(false);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  
    const toggleDropdown = () => {
      setIsDropdownOpen((prevState) => !prevState);
    };
  
    const toggleSidebar = () => {
      setIsSidebarOpen((prevState) => !prevState); 
    };

    const handleLogout = () => {
      toast.info("Oops Logged Out!")
      dispatch(logoutSuccess())
    };

    const handleProfileChanger = async (e) => {
      setIsDropdownOpen(false);
      setShowLoadingButton(true)
      e.preventDefault();
      let file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "akash_khare");

      try {
        let res = await axios.post("https://api.cloudinary.com/v1_1/dqo56owj9/auto/upload", formData);
        let data = await res.data
        if(data.secure_url) {
         try {
          let res2 = await axios.put(`${url}/users/updateUser`, {profilePic: data.secure_url}, {withCredentials: true, headers: {
            "Authorization": User?.token
           }});
           if (res2.status === 200 || 201) {
            toast.success(res2.data.msg);
            dispatch(updateProfilePic(res.data.secure_url));
           }
         } catch (error) {
          toast.error(error.response.data.msg);
         }
         
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setShowLoadingButton(false);
      }
    };

    const handleNameSubmit = async () => {
      if (!nameRef.current.value.trim()) {
       return toast.info("Name is required");
      }
      let obj = {
        name: nameRef.current.value
      };
      try {
        setIsDropdownOpen(false);
        setIsNameModalOpen(false)
        setShowLoadingButton(true)
        let res = await axios.put(`${url}/users/updateUser`, obj, {withCredentials: true, headers: {
          "Authorization": User?.token
        }});
        if(res.status === 200 || 201) {
          toast.success(res.data.msg);
          dispatch(updateUserName(res.data.findUser.name));
          nameRef.current.value = ""
        }
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setShowLoadingButton(false);
      }
      
    };

    const handlePasswordChange = async (e) => {
      e.preventDefault();
      if (!passwordRef.current.currentPass.value.trim() || !passwordRef.current.newPass.value.trim() || !passwordRef.current.confirmPass.value.trim()) {
        return toast.info("All fields are required");
      }

      let obj = {
        currentPassword: passwordRef.current.currentPass.value,
        newPassword: passwordRef.current.newPass.value,
        confirmNewPassword: passwordRef.current.confirmPass.value
      }

      try {
        setIsDropdownOpen(false);
        setIsPasswordModalOpen(false);
        setShowLoadingButton(true);

        let res = await axios.put(`${url}/users/updateUser`, obj, {withCredentials: true, headers: {
          "Authorization": User?.token
        }})

        if (res.status === 200 || 201) {
          toast.success(res.data.msg);
          dispatch(logoutSuccess());
          passwordRef.current.currentPass.value = ""
          passwordRef.current.newPass.value = ""
          passwordRef.current.confirmPass.value = ""
        }
      } catch (error) {
        toast.error(error.response.data.msg);
      } finally {
        setShowLoadingButton(false);
      }
    };




return (
<div>


<nav className="fixed top-0 z-50 w-full  border-b border-gray-200">
    <div className="px-3 py-3 lg:px-5 lg:pl-3">
      <div className="flex items-center justify-between">



        <div className="flex items-center justify-start rtl:justify-end">


          <button
            data-drawer-target="logo-sidebar"
            data-drawer-toggle="logo-sidebar"
            aria-controls="logo-sidebar"
            type="button"
            onClick={toggleSidebar} 
            className="inline-flex items-center p-2 text-sm  rounded-lg sm:hidden  focus:outline-none "
          >
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              />
            </svg>
          </button>



          <Link to="/" className="flex ms-2 md:me-24">
            <img
              src="\public\logo.webp"
              className="h-8 rounded-full me-3"
              alt="Mail Box"
            />
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
              Mail Box
            </span>
          </Link>


        </div>



        <div className="flex items-center">
          <div className="flex items-center ms-3">
            <div className="relative">

              {
                showLoadingButton ? (<LoadingButton width={10} content={"Loading"} />) : (<button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full "
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src={User?.userDetails?.profilePic}
                    alt="Profile Pic"
                  />
                </button>)
              }
              
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48  border border-gray-200 rounded-lg shadow-lg "
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-yellow-200">
                      {
                          User?.userDetails?.name                              
                      }
                    </p>
                    <p className="text-sm   truncate  font-semibold text-yellow-400">
                      {
                        User?.userDetails?.email
                      }
                    </p>
                  </div>
                  <ul className="py-1">
                    <li>
                      <label
                        htmlFor='profilePic'
                        className="block cursor-pointer px-4 py-2 text-sm text-white"
                      >
                        Update Avatar
                      </label>
                      <input onChange={handleProfileChanger} type="file" id='profilePic' hidden />
                    </li>
                    <li>
                      <button
                        onClick={() => {setIsPasswordModalOpen(true); setIsDropdownOpen(false)}}
                        className="block px-4 py-2 text-sm text-white"
                      >
                        Update Password
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {setIsNameModalOpen(true); setIsDropdownOpen(false);}}
                        className="block px-4 py-2 text-sm text-white"
                      >
                        Update Username
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        to="#"
                        className="block px-4 py-2 text-sm text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>




      </div>
    </div>
</nav>

      

<aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-48 h-screen pt-20 transition-transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } border-r border-white sm:translate-x-0`} aria-label="Sidebar">
  <div className="h-full px-3 pb-4 overflow-y-auto">

  
   
    <ul className="space-y-2 font-medium">
      <li>
        <Link to="/" className="flex items-center p-2 rounded-lg text-white  group">
          <svg className="w-5 h-5 transition duration-75  text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
            <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
            <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
          </svg>
          <span className="ms-3">Home</span>
        </Link>
      </li>
      <li>
        <Link to="/recieveMail" className="flex items-center p-2 rounded-lg text-white  group">
          <svg className="shrink-0 w-5 h-5  transition duration-75   text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
         
        </Link>
      </li>
      <li>
        <Link to="/sentMail" className="flex items-center p-2  rounded-lg text-white   group">
          <svg className="shrink-0 w-5 h-5  transition duration-75   text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Sent</span>
         
        </Link>
      </li>
      <li>
        <Link to= {`/account?user=${User?.userDetails?.name}`} className="flex items-center p-2  rounded-lg text-white  group">
          <svg className="shrink-0 w-5 h-5  transition duration-75  text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Account</span>
        </Link>
      </li>
      
      <li>
        <button onClick={handleLogout} href="" className="flex items-center p-2  rounded-lg text-white  group">
          <svg className="shrink-0 w-5 h-5  transition duration-75  text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
          </svg>
          <span className="flex-1 ms-3 whitespace-nowrap">Log out</span>
        </button>
      </li>
     
    </ul>
  </div>
</aside>



{/* name modal part */}
      <Modal
          open={isNameModalOpen}
          zIndex={10} 
          footer={
            <Button key="submit" type="primary" onClick={handleNameSubmit}>
              Submit
            </Button>
          }
          onCancel={() => setIsNameModalOpen(false)}
          centered
          width={400}
          className="custom-modal"
      >
          <div className='bg-gray-800'>
            <label className='bg-gray-800' htmlFor="name">Enter Your New UserName</label>
            <input ref={nameRef} required className='w-full rounded-md mt-3 text-black focus:outline-none' placeholder='Enter new name' type="text" id='name' />
          </div>
      </Modal>  


{/* password modal part */}
      <Modal
          open={isePasswordModalOpen}
          zIndex={10} 
          footer={
            <Button key="submit" type="primary" onClick={handlePasswordChange}>
              Submit
            </Button>
          }
          onCancel={() => setIsPasswordModalOpen(false)}
          centered
          width={400}
          className="custom-modal"
      >
          <form ref={passwordRef} className='bg-gray-800 flex flex-col gap-6'>
            <div className='bg-gray-800'>
            <label className='bg-gray-800' htmlFor="currentPass">Enter Your Current Password</label>
            <input required className='w-full rounded-md mt-2 text-black focus:outline-none' placeholder='Enter current Password' type="password" id='currentPass' name='currentPass' />
            </div>
           
  
            <div className='bg-gray-800'>
            <label className='bg-gray-800' htmlFor="newPass">Enter Your New Password</label>
            <input required className='w-full rounded-md mt-2 text-black focus:outline-none' placeholder='min 8, special, UpperCase, number' type="password" id='newPass' name='newPass' />
            </div>
            

            <div className='bg-gray-800'>
            <label className='bg-gray-800' htmlFor="confirmPass">Confirm Your New Password</label>
            <input required className='w-full rounded-md mt-2 text-black focus:outline-none' placeholder='Confirm new Password' type="text" id='confirmPass' name='confirmPass' />
            </div>
            
          </form>
      </Modal>  

</div>
  )
}

export default NavbarWithSidebar
