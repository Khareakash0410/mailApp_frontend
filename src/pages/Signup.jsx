import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoadingButton from '../components/LoadingButton';
import { useDispatch } from 'react-redux';
import { loginFailed, loginSuccess } from '../store/slice/UserSlice';

const Signup = () => {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

 const [loading, setLoading] = useState(false);


  const handleInputChanger = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  }


  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Validate Name (Only alphabets, min 3 characters)
    if (!/^[a-zA-Z\s]{3,}$/.test(user.name)) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Validate Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Validate Password (Min 6 characters, one capital letter, one small letter ,at least one number and one special character)
    if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/.test(user.password)) {
      newErrors.password =
        "Password must include minimum 8 charatcers, special characters, number, capital letter ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleRegisterUser = async (e) => {
    e.preventDefault();
   
if (validate()) {
  
  try {
    setLoading(true)
    let res = await axios.post(`${url}/users/createUser`, user, {
      withCredentials: true
    });
   if (res.status === 200 || 201) {
     setUser({
      name: "",
      email: "",
      password: ""
     })
     toast.success(res.data.msg);
     dispatch(loginSuccess(res.data));

   }
   } catch (error) {
    toast.error(error.response.data.msg);
     dispatch(loginFailed());
   }   finally {
    setLoading(false)
   }
} 
}



  return (
   <div className="flex flex-col justify-center font-[sans-serif] sm:h-screen p-4">
    <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">


    <div className="text-center mb-8">
    <img src="\public\logo.webp" alt="logo" className="w-20 h-20 rounded-full inline-block" />
    <h1 className='text-white font-semibold'>SignUp Your Account</h1>
     
    </div>

    <form>

      <div className="space-y-3">


        <div>
          <label className="text-gray-200 text-sm mb-2 block">Name</label>
          <input name="name" value={user.name} onChange={handleInputChanger} type="text" className="text-gray-800 bg-gray-200 border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your Name" />
          {errors.name && <small className="error text-red-500">{errors.name}</small>}
        </div>


        <div>
          <label className="text-gray-200 text-sm mb-2 block">Email Id</label>
          <input value={user.email} name="email" onChange={handleInputChanger} type="email" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your Email Id" />
          {errors.email && <small className="error text-red-500">{errors.email}</small>}
        </div>


        <div>
          <label className="text-gray-200 text-sm mb-2 block">Password</label>
          <input value={user.password} name="password" onChange={handleInputChanger} type="password" className="text-gray-800 bg-white border border-gray-200 w-full text-sm px-4 py-3 rounded-md outline-blue-500" placeholder="Enter your password" />
          {errors.password && <small className="error text-red-500">{errors.password}</small>}
        </div>

       
      </div>

      <div className="!mt-8">

         {
          loading ? 
          (<LoadingButton content={"Registering"} />) 
          : 
          (  <button type="button" onClick={handleRegisterUser} className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
            Create an account
          </button>)
         }
      
      </div>
      
      <p className="text-gray-100 text-sm mt-6 text-center">Already have an account? 
        <Link to={"/signin"} className="text-blue-600 font-semibold hover:underline ml-1">Login here</Link>
      </p>


    </form>
   </div>
   </div>

  )
}

export default Signup;
