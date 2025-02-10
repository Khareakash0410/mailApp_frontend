import {createSlice} from "@reduxjs/toolkit";



const SocketSlice = createSlice({
    name: "socket",
    initialState: {
     isConnected : false
    },

    reducers: {

      setOnline (state, action) {
        state.isConnected = action.payload;
      },

    }
});



export const {setOnline} = SocketSlice.actions;

export default SocketSlice;