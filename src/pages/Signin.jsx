import axios from 'axios';
import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { useDispatch } from 'react-redux';
import { loginFailed, loginSuccess } from '../store/slice/UserSlice';

const Signin = () => {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

  let dispatch = useDispatch();

  let inputRef = useRef(null);
 

  const [loading, setLoading] = useState(false);


  const handleLoginUser = async (e) => {
    e.preventDefault();

    const user = {
      email: inputRef.current.email.value,
      password: inputRef.current.password.value
    }

    
   
    try {
      setLoading(true)
      let res = await axios.post(`${url}/users/loginUser`, user, {withCredentials: true});

      if (res.status === 200 || 201) {
        toast.success(res.data.msg);
        inputRef.current.reset();
        dispatch(loginSuccess(res.data))
      }
    } catch (error) {
      toast.error(error.response.data.msg);
      dispatch(loginFailed)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
    <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">


    <div className="text-center mb-8">
    <img src="https://res.cloudinary.com/dqo56owj9/image/upload/v1739180039/logo_xrreag.webp" alt="logo" className="w-20 h-20 rounded-full inline-block" />
    <h1 className='text-white font-semibold'>SignIn Your Account</h1>
     
    </div>

    <form ref={inputRef}>

      <div className="space-y-3">

        <div>
          <label className="text-gray-200 text-sm mb-2 block">Email Id</label>
          <input name="email"  type="email" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your Email Id" />
        </div>

        <div>
          <label className="text-gray-200 text-sm mb-2 block">Password</label>
          <input name="password" type="password" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your password" />
        </div>
       
      </div>

      <p className="text-gray-100 text-sm mt-6 text-center">Forget your Password? 
        <Link to={"/password/forget"} className="text-yellow-500 font-semibold hover:underline ml-1">Click here</Link>
      </p>

      <div className="!mt-8">

        {
          loading ? 
          (<LoadingButton content="Logging In" />)
           : 
           ( <button type="button" onClick={handleLoginUser} className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Login to account
          </button>)
        }
       
      </div>
      
      <p className="text-gray-100 text-sm mt-6 text-center">Don't have an account? 
        <Link to={"/signup"} className="text-blue-600 font-semibold hover:underline ml-1">Register here</Link>
      </p>


    </form>
   </div>
   </div>
  )
}

export default Signin;
