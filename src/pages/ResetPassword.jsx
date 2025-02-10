import axios from 'axios';
import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"


  const {resetToken} = useParams();

  const navigate = useNavigate();

  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);


  const handleChangePassword = async (e) => {
    e.preventDefault();

    let obj = {
      password: passwordRef.current.password.value,
      confirmPassword: passwordRef.current.cpassword.value
    }

    try {
      setLoading(true)

      let res = await axios.put(`${url}/users/resetPassword/${resetToken}`, obj, {withCredentials: true});

      if (res.status === 200 || 201) {
        toast.success(res.data.msg);
        passwordRef.current.reset();
        navigate("/signin")
      }
    } catch (error) {
      toast.error(error.response.data.msg)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
    <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">


    <div className="text-center mb-8">
    <img src="https://res.cloudinary.com/dqo56owj9/image/upload/v1739180039/logo_xrreag.webp" alt="logo" className="w-20 h-20 rounded-full inline-block" />
    <h1 className='text-white font-semibold'>Reset Your Password</h1>
     
    </div>

    <form ref={passwordRef}>

      <div className="space-y-3">

        <div>
          <label className="text-gray-200 text-sm mb-2 block">Password</label>
          <input name="password" type="password" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your Password" />
        </div>

        <div>
          <label className="text-gray-200 text-sm mb-2 block">Confirm Password</label>
          <input name="cpassword" type="text" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Confirm your password" />
        </div>
       
      </div>

      <div className="!mt-8">
        {
          loading ? 
          (<LoadingButton content={"Resetting"} />)
          :
          (<button onClick={handleChangePassword} type="button" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Change Password
          </button>)
        }
        
      </div>


    </form>
   </div>
   </div>
  )
}

export default ResetPassword
