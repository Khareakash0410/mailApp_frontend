import React, { useEffect, useState } from 'react'
import NavbarWithSidebar from '../components/NavbarWithSidebar'
import { Link, useLocation } from 'react-router-dom'
import ComposeEmailButton from '../components/ComposeEmailButton'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowBigDownDash, CornerRightUp, Pill, Trash2 } from 'lucide-react'

const SingleMail = () => {

let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"
 
const location = useLocation();

const [singleMail, setSingleMail] = useState(location.state?.mail || null);
const [mailExist, setMailExist] = useState(!!location.state?.mail);

const User = useSelector((state) => state.user);

const mailId = location.state;


async function getSingleMail() {
   if(!mailId) {
    return;
   }
    try {
        let res = await axios.get(`${url}/mails/singleMail/${mailId}`, {withCredentials: true, headers: {
            "Authorization": User?.token
        }});
        let data = await res.data;
        setSingleMail(data.findSingleMail);
        setMailExist(true)
    } catch (error) {
        toast.error(error.response.data.msg);
    }
}


const handleDeleteMail = async () => {

  if (!singleMail?._id) {
    toast.info("Please try after sometime");
    return;
  }
  try {
      let res = await axios.delete(`${url}/mails/delete/mail/${mailId}`, {withCredentials: true, headers: {
        "Authorization": User?.token
       }});
  
       if(res.status === 200 || 201) {
        toast.success(res.data.msg);
        setMailExist(false)
       }
    } catch (error) {
      toast.error(error.response.data.msg);
  }   
}




useEffect(() => {
  if(!singleMail) {
    getSingleMail();
  }
}, [mailId, User?.token]);






return (
<div className='relative min-h-screen w-full'>
     
<NavbarWithSidebar />

<div className="p-4 sm:ml-48">
    <div className='p-4 bg-gray-800 flex flex-col gap-1 w-full relative shadow-lg border-[1px]  border-green-500 rounded-lg mt-14'>
 
  {mailExist ? 
     <>
      {
        singleMail?.to === User?.userDetails?.email ? 
        (
          <div className='bg-gray-800 flex items-center gap-1 sm:gap-3 '>
          <ArrowBigDownDash color='yellow' size={20} className='bg-gray-800 shrink-0 flex-none' />
          <span className='text-lg font-serif text-yellow-100 bg-gray-800 truncate flex-grow'>{singleMail?.from}</span>
          </div>
        ) 
        : 
        (
           <div className='bg-gray-800 flex items-center gap-1 sm:gap-3 '>
            <CornerRightUp color='yellow' size={20} className='bg-gray-800 shrink-0 flex-none' />
            <span className='text-lg font-serif text-yellow-100 bg-gray-800 truncate flex-grow'>{singleMail?.to}</span>
            </div>
        )
       }
    
    
    
    
        <h3 className='bg-gray-800 mt-2 font-bold capitalize text-md'>
            {singleMail?.subject}
        </h3>
    
        <p className="mt-3 bg-gray-800 text-sm leading-loose">
          {
            singleMail?.body
          }
        </p>
    
        {
       singleMail?.file && (
        <a
          className="bg-gray-800 sm:mt-4 mt-2"
          href={singleMail?.file}
          target="_blank"
          rel="noopener noreferrer"
        >
          {
            singleMail?.file.endsWith(".jpg") || 
            singleMail?.file.endsWith(".webp") || 
            singleMail?.file.endsWith(".jpeg") || 
            singleMail?.file.endsWith(".png") || 
            singleMail?.file.endsWith(".gif") ? (
              <img
                className="sm:w-64 sm:h-64 h-40 w-40 bg-gray-800 rounded-lg"
                src={singleMail?.file}
                alt="Attachment"
              />
            ) : (
              <p className="text-sm font-serif text-blue-400 bg-gray-800 flex items-center">
                <Pill size={18} className="mr-1 bg-gray-800" />
                Find your attachments here
              </p>
            )
          }
        </a>
      )
    }
    
    
        <p className="mt-2  border-[1px] w-fit rounded-lg px-1 bg-red-300 border-yellow-200 text-blue-800">
          Mail Box team
        </p>
    
    
        <button onClick={handleDeleteMail} className='absolute top-2 right-2 bg-gray-800 '>
        <Trash2 className='bg-gray-800 transition-transform duration-[1000ms] hover:rotate-360' size={18} color='red' />
        </button>
     </>
  : 
     (
      <span className='bg-gray-800'>
        No Mail Found.
      </span>
     )
  }

    </div>
</div>



<Link to={"/send/mail"} className='fixed right-2 bottom-2'>
<ComposeEmailButton />
</Link>

</div>
  )
}

export default SingleMail;
