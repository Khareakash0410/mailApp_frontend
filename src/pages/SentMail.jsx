import React, { useEffect, useState } from 'react'
import NavbarWithSidebar from '../components/NavbarWithSidebar'
import { useSelector } from 'react-redux'
import axios from 'axios';
import { toast } from 'react-toastify';
import { BookType, CornerRightUp, MessageSquareText, Paperclip, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ComposeEmailButton from '../components/ComposeEmailButton';

const SentMail = () => {

    let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const [sentMails, setSentMails] = useState([]);

    const [selectedMails, setSelectedMails] = useState([]);

    const User = useSelector((state) => state.user);

    const indexOfLastMail = currentPage * itemsPerPage;
    const indexOfFirstMail = indexOfLastMail - itemsPerPage;
    const currentMails = sentMails.slice(indexOfFirstMail, indexOfLastMail);


    const totalPages = Math.ceil(sentMails.length / itemsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    

    async function getSentMails() {

        try {
            let res = await axios.get(`${url}/mails/sendMails`, {withCredentials: true, headers : {
                "Authorization": User?.token
            }});

            if(res.status === 200 || 201) {
                setSentMails(res.data.SentMails);
            }
        } catch (error) {
            toast.error(error.response.data.msg);
        }
    }



    const toggleSelectedMail = (mailId) => {
        setSelectedMails((prevSelected) =>
            prevSelected.includes(mailId)
                ? prevSelected.filter((id) => id !== mailId)
                : [...prevSelected, mailId]
        );
    };



    const deleteSelectedMails = async () => {
        try {
            for (const _id of selectedMails) {
                await axios.delete(`${url}/mails/delete/sendMail/${_id}`, {
                    withCredentials: true,
                    headers: { "Authorization": User?.token }
                });
            }
            setSentMails((prevMails) => prevMails.filter((mail) => !selectedMails.includes(mail._id)));
            setSelectedMails([]);
            toast.success("Mail deleted successfully");
        } catch (error) {
            toast.error("Error deleting mails");
            console.log(error)
        }
    };


useEffect(() => {
    getSentMails();
}, [User?.token]);



return (
<div className='relative min-h-screen w-full'>
      
<NavbarWithSidebar />

<div className="p-4 flex flex-col sm:ml-48">


    {
        selectedMails.length > 0 && (

            <div className='flex sm:flex-row flex-col sm:justify-end items-end  mt-14 gap-3'>
            <button
            onClick={() => setSelectedMails([])}
            className="bg-green-400 px-2 py-1 text-white rounded-md w-fit"
            >   Unselect
            <X className='inline ml-1 mb-1 bg-green-400' size={18}/>
            </button>

            <button
                onClick={deleteSelectedMails}
                className="bg-red-600 px-2 py-1 text-white rounded-md w-fit"
            >   Delete
                <Trash2 className='inline ml-1 mb-1 bg-red-600' size={18} />
            </button>
            </div>

        
        )
    }




    {
        currentMails?.map((element, index) => {
            return (
                <Link to={`/singleMail?id=${element._id}`} state={element._id} key={index} className="p-4 bg-gray-800 flex flex-col gap-1 w-full shadow-lg border-[1px]  relative border-green-500 rounded-lg mt-14  transition-transform duration-300 hover:scale-y-110">




                       <input
                            onClick={(e) => e.stopPropagation()} 
                            type="checkbox"
                            checked={selectedMails.includes(element._id)}
                            onChange={() => toggleSelectedMail(element._id)}
                            className="absolute cursor-crosshair right-1 focus:outline-none focus-within:outline-none top-1 w-4 h-4"
                        />


                   <div className='bg-gray-800 flex items-center gap-1 sm:gap-3 '>
                    <CornerRightUp color='yellow' size={20} className='bg-gray-800 shrink-0 flex-none' />
                    <span className='text-lg font-serif text-yellow-100 bg-gray-800 truncate flex-grow'>{element?.to}</span>
                   </div>

                   <div className=' bg-gray-800 flex items-center gap-1 sm:gap-3  ml-8'>
                    <BookType className='bg-gray-800 shrink-0 flex-none' color='blue' size={20} />
                    <span className='text-md font-semibold bg-gray-800 truncate flex-grow'>
                    {
                    element?.subject
                    }
                    </span>
                   </div>

                   <div className='bg-gray-800 flex items-center gap-1 sm:gap-3 ml-8'>
                    <MessageSquareText className='bg-gray-800 shrink-0 flex-none' color='green' size={18} />
                    <span className='text-sm  font-light bg-gray-800 truncate flex-grow'>
                    {
                        element?.body
                    }
                    </span>
                   </div>

                   {
                    element?.file ?
                    (<div className='bg-gray-800 flex items-center gap-1 sm:gap-3 ml-8'>
                        <Paperclip className='bg-gray-800 shrink-0 flex-none' color='red' size={18} />
                        <p className='text-sm  bg-gray-800 font-serif truncate flex-grow'>Attachement</p>
                    </div>) 
                    : 
                    ("")
                   }
                   
                </Link>
            )
        })
    }
  
</div>



<div className="flex sm:ml-48 sm:justify-center justify-start mt-2 mb-1 gap-2">
    <button 
        onClick={prevPage} 
        disabled={currentPage === 1}
        className="px-2 bg-gray-700 text-white rounded-md disabled:opacity-30"
    >
        {"<"}
    </button>

    <span className="text-white">📃 {currentPage} of {totalPages}</span>

    <button 
        onClick={nextPage} 
        disabled={currentPage === totalPages}
        className="px-2 bg-gray-700 text-white rounded-md disabled:opacity-30"
    >
        {">"}
    </button>
</div>





<Link to={"/send/mail"} className='fixed right-2 bottom-2'>
<ComposeEmailButton />
</Link>

</div>
  )
}

export default SentMail;
