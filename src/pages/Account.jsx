import React from 'react'
import NavbarWithSidebar from '../components/NavbarWithSidebar'
import { Link } from 'react-router-dom'
import ComposeEmailButton from '../components/ComposeEmailButton'
import { useSelector } from 'react-redux'

const Account = () => {


const User = useSelector((state) => state.user);





return (
<div className='relative min-h-screen w-full'>

<NavbarWithSidebar />    

<div className="p-4 flex flex-col sm:ml-48">

<div className="p-4 text-center relative w-full flex flex-col shadow-lg border-[2px] border-red-400 rounded-lg mt-14">

  <img className="mx-auto mb-4 w-36 h-36 rounded-full" src={User?.userDetails?.profilePic} alt="ProfilePic" />

  <h3 className="mb-1 text-2xl font-bold tracking-tight">
  {User?.userDetails?.name}
  </h3>

  <p className=' truncate flex-1 font-serif text-lg'>{User?.userDetails?.email}</p>

  <ul className="flex flex-col sm:flex-row justify-center mt-4 gap-4 sm:gap-6">
    <li>
      <Link  to="/sentMail" className="text-black border-[1px] rounded-lg px-2 py-1 bg-blue-100 border-green-200">
        View Sent Mails
        ({
          User?.userDetails?.sendMails?.length
        })
      </Link>
    </li>
    <li>
      <Link to="/recieveMail" className="text-black border-[1px] rounded-lg px-2 py-1 bg-blue-100 border-green-200">
        View Recieve Mails
        ({
          User?.userDetails?.recieveMails?.length
        })
      </Link>
    </li>
  </ul>

  <Link to={`/allMedia?user=${User?.userDetails?.name}`} className='absolute top-1 right-1 sm:px-2 sm:py-1 sm:top-4 sm:right-4 border-[1px] border-green-300 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-500 sm:rounded-lg text-black px-[2px] rounded-md py-0 text-sm sm:text-md'>
    All Media 
  </Link>



</div>

</div>

<Link to={"/send/mail"} className='fixed right-2 bottom-2'>
<ComposeEmailButton />
</Link>
  
</div>
  )
}

export default Account
