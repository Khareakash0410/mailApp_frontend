import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import ForgetPassword from './pages/forgetPassword'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import ComposeMail from './pages/ComposeMail'
import ProtectedRoute from './components/ProtectedRoute'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getUserSuccess, logoutSuccess } from './store/slice/UserSlice'
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import SentMail from './pages/SentMail'
import RecievedMail from './pages/RecievedMail'
import SingleMail from './pages/SingleMail'
import Account from './pages/Account'
import AllMedia from './pages/AllMedia'
import connectToSocket from './store/socket/SocketManager'



function App() {

  let url = import.meta.env.VITE_DEPLOYEMENT === "production" ? import.meta.env.VITE_ENDPOINT : "http://localhost:8080"

  const [isModalOpen, setIsModalOpen] = useState(false);

  const Socket = useSelector((state) => state.socket);

  const User = useSelector((state) => state.user);

  const isAuthenticated = User.login;

  const dispatch = useDispatch();

  async function getUser() {
   try {
    let res = await axios.get(`${url}/users/getUser`, {
      withCredentials: true, headers: {
        "Authorization": User.token
      }
    });
    if (res.status === 200 || 201) {
      dispatch(getUserSuccess(res.data));
    }
   } catch (error) {
    console.log(error.response.data.msg);
    if (error.response.status === 400 || 401) {
      setIsModalOpen(true)      
      setTimeout(() => {
        dispatch(logoutSuccess());
        setIsModalOpen(false);
      }, 3000);
    }
   }
  }

useEffect(() => {
  if (User?.token) {
    getUser();
  }
}, [User?.token]);



useEffect(() => {
  if (User?.userInfo) {
    connectToSocket(dispatch, User?.userInfo);
  }
}, [User?.userInfo]);




return (
   <>
    
    <Router>

    <Modal
      open={isModalOpen}
      footer={null}
      closable={false}
      centered
      width={400}
    >
      <div className="text-center">
        <ExclamationCircleOutlined
          style={{ fontSize: "36px", color: "#faad14", marginBottom: "16px" }}
        />
        <h2 className="text-lg font-semibold text-red-500">Session Expired</h2>
        <p className="text-gray-600">You have been logged out for security reasons.</p>
      </div>
    </Modal>

    <Routes>


                 {/* Public routes */}
      <Route path='/signin' element={isAuthenticated ? <Navigate to={"/"} /> : <Signin />}/>
      <Route path='/signup' element={isAuthenticated ? <Navigate to={"/"} /> : <Signup />}/>
      <Route path='/password/forget' element={isAuthenticated ? <Navigate to={"/"} /> : <ForgetPassword />}/>
      <Route path='/password/reset/:resetToken' element={isAuthenticated ? <Navigate to={"/"} /> : <ResetPassword />}/>



{
  Socket.isConnected && <>

                 {/* Protected Routes */}
                 <Route path='/' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Home />} />}/>    
      <Route path='/send/mail' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<ComposeMail />} />}/>
      <Route path='/sentMail' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<SentMail />} />}/>
      <Route path='/recieveMail' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<RecievedMail />} />}/>
      <Route path='/singleMail' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<SingleMail />} />}/>
      <Route path='/account' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Account />} />}/>
      <Route path='/allMedia' element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<AllMedia />} />}/>

     

           {/* Catch-all for unknown routes */}
      <Route path="*" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Navigate to="/" />} />} />

  </>
}

    </Routes>

     <ToastContainer position='bottom-right' theme='dark' autoClose={3000} pauseOnHover={false} />

    </Router>
     

   </>
  )
}

export default App;
