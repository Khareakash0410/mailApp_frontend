import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';

const ForgetPassword = () => {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();


  const handleSendEmail = async (e) => {
    e.preventDefault();

    let obj = {
      email: emailRef.current.value
    }

    try {
      setLoading(true)
      let res = await axios.post(`${url}/users/forgetPassword`, obj, {withCredentials: true});

      if (res.status === 200 || 201) {
        toast.success(res.data.msg);
        emailRef.current.reset();
        navigate("/signin");
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
    <img src="\public\logo.webp" alt="logo" className="w-20 h-20 rounded-full inline-block" />
    <h1 className='text-white font-semibold'>Forget Password </h1>
     
    </div>

    <form>

   

        <div>
          <label className="text-gray-200 text-sm mb-2 block">Email Id</label>
          <input ref={emailRef} name="email" type="email" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your Email Id" />
        </div>
       
   

      <div className="!mt-8">
        {
          loading ? 
          (<LoadingButton content={"Sending"} />) 
          : 
          (<button onClick={handleSendEmail} type="button" className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Send Link
          </button>)
        }
        
      </div>
      
      <p className="text-gray-100 text-sm mt-6 text-center">Remember Your Password?
        <Link to={"/signin"} className="text-blue-600 font-semibold hover:underline ml-1">Login here</Link>
      </p>


    </form>
   </div>
   </div>
  )
}

export default ForgetPassword
