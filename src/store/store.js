import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slice/UserSlice'
import SocketSlice from './slice/SocketSlice'

export default configureStore({
  reducer: {
    user: UserSlice.reducer,
    socket: SocketSlice.reducer,
  },
});