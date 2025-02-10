import React, { useRef, useState } from 'react'
import NavbarWithSidebar from '../components/NavbarWithSidebar'
import { CircleCheckBig, Paperclip } from 'lucide-react';
import LoadingButton from '../components/LoadingButton';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getSocket } from '../store/socket/SocketManager';

const ComposeMail = () => {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

    let socket = getSocket();

    const User = useSelector((state) => state.user);

    const [media, setMedia] = useState("");
    const [mediaName, setMediaName] = useState("");

    const mailRef = useRef();

    const [loading, setLoading] = useState(false);



    const handleFileChanger = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "akash_khare");
      try {

        if (
        file.name.endsWith(".jpg") || 
        file.name.endsWith(".jpeg") || 
        file.name.endsWith(".webp") || 
        file.name.endsWith(".png") || 
        file.name.endsWith(".gif")) {
          let res = await axios.post("https://api.cloudinary.com/v1_1/dqo56owj9/image/upload", formData);
          let data = await res.data;
          if(data.secure_url) {
          setMedia(data.secure_url);
          setMediaName(data.original_filename);
          }
        }

        else {
          let res = await axios.post("https://api.cloudinary.com/v1_1/dqo56owj9/raw/upload", formData);
          let data = await res.data;
          if(data.secure_url) {
          setMedia(data.secure_url);
          setMediaName(data.original_filename);
        }
       }
        
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }
    }


    const handleSendEmail = async (e) => {
        e.preventDefault();
        let obj = {
            to: mailRef.current.to.value,
            subject: mailRef.current.subject.value,
            body: mailRef.current.body.value,
            file: media
        }

        socket?.emit("sendMail", {...obj, from: User?.userDetails?.email});

        try { 
            setLoading(true);
            let res = await axios.post(`${url}/mails/send`, obj, {
              withCredentials: true, 
              headers: {
                "Authorization": User?.token
              }
            });
            if(res.status === 200 || 201) {
              toast.success(res.data.msg) 
              mailRef.current.reset();
              setMedia("");    
              setMediaName("");        
            }
        } catch (error) {
            toast.error(error.response.data.msg)
        } finally {
            setLoading(false)
        }
    }

return (
<div className='relative min-h-screen w-full'>
      

<NavbarWithSidebar />

<div className="p-4 sm:ml-48 mt-14">
        <div className="max-w-3xl mx-auto px-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-teal-500 text-center mb-4">Compose a Mail</h2>

          <form onSubmit={handleSendEmail} ref={mailRef} className="space-y-4">

            {/* To */}
            <div>
              <label className="block text-white font-medium">To</label>
              <input
                type="email"
                name="to"   
                placeholder='Enter reciever email'     
                className="w-full p-2 text-gray-800 bg-gray-200 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder='Enter Subject for email'   
                className="w-full text-gray-800 p-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
                required
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-white font-medium">Body</label>
              <textarea
                name="body"            
                rows="5"
                placeholder='Enter description for your email'   
                className="w-full text-gray-800 p-2 bg-gray-200 border rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
                required
              ></textarea>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor='file' className="block cursor-pointer text-white font-medium">
                {
                  media ? 
                  (
                    <span className='flex gap-2 items-center'>
                       <CircleCheckBig size={36} color='green' />
                       <p className='truncate'>{mediaName
                       }</p>
                    </span>
                
                  ) 
                  : 
                  (
                    <span className='flex gap-2 items-center'>
                     <Paperclip size={24} color='skyblue' />
                     <p>No File selected</p>
                    </span>     
                  )
                }</label>
              <input
                onChange={handleFileChanger}
                hidden
                id='file'
                type="file"
                className="w-full text-gray-800 border bg-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Send Button */}
            <div className="text-center">
                {
                 loading ? 
                 (<LoadingButton content={"Sending Mail"} />)
                 :
                 (<button type="submit" className="text-white w-full bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-teal-300  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Send Mail</button>)
                }
          

            </div>

          </form>
        </div>
</div>


</div>
  )
}

export default ComposeMail;
