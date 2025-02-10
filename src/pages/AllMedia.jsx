import React, { useEffect, useState } from 'react'
import NavbarWithSidebar from '../components/NavbarWithSidebar'
import { Link } from 'react-router-dom'
import ComposeEmailButton from '../components/ComposeEmailButton'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'

const AllMedia = () => {

    let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

    const [allMedia, setAllMedia] = useState([]);

    const User = useSelector((state) => state.user);

    async function getAllMedia() {
        try {
            let res = await axios.get(`${url}/mails/allMails`, {withCredentials: true, headers: {
                "Authorization": User?.token
            }});
            let data = await res.data;

            if(res.status === 200 || 201) {
                setAllMedia(data.findMails)
            }
        } catch (error) {
           toast.error(error.response.data.msg); 
        }
    }

useEffect(() => {
  getAllMedia();
}, [User?.token]);





return (
<div className='relative min-h-screen w-full'>

<NavbarWithSidebar />

<div  className="p-4 sm:ml-48 mt-14 flex justify-center">
    

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

    {
        allMedia.map((element) => {
            return (  
                    element.file ? 
                    (<Link
                        to={element?.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        {
                           [".jpg", ".jpeg", ".png", ".gif", ".webp"].some(ext => element.file.endsWith(ext)) ? 
                           (<img
                            className="sm:w-42 sm:h-42 md:h-64 md:w-64 h-52 w-52 rounded-lg"
                            src={element?.file}
                            alt="Attachment"
                           />) 
                           : 
                           [".mp4", ".mov", ".avi", ".mkv", ".webm"].some(ext => element.file.endsWith(ext)) ? 
                           (
                            <div className="sm:w-42 sm:h-42 md:h-64 md:w-64 h-52 w-52 flex justify-center items-center">
                            <video 
                              controls 
                              src={element?.file}  
                            >
                            </video>
                            </div>
                           
                           ) 
                           : 
                           [".mp3", ".wav", ".aac", ".flac", ".ogg"].some(ext => element.file.endsWith(ext)) ? 
                           (<div className="sm:w-42 sm:h-42 md:h-64 md:w-64  h-52 w-52 flex justify-center items-center bg-gray-800">
                           <audio
                              controls 
                              src={element?.file}  
                              className='bg-gray-800'
                              >
                           </audio>
                           </div>
                           )
                           :
                           ((<div
                            className="sm:w-42 sm:h-42 md:h-64 md:w-64 h-52 w-52 bg-gray-800 flex flex-col gap-4 justify-center items-center rounded-lg"
                            
                           >
                            <span className='bg-gray-800'>
                                Document File
                            </span>
                            <span className='bg-gray-800'>
                                Download to view
                            </span>
                           </div>))
                        }
                        </Link>) 
                    : 
                    (<span className='hidden'></span>)                
            )
        })
    }

</div>

</div>

<Link to={"/send/mail"} className='fixed right-2 bottom-2'>
<ComposeEmailButton />
</Link>

</div>
  )
}

export default AllMedia
