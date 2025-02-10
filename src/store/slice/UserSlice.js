import { createSlice } from "@reduxjs/toolkit";

let localStorageData = JSON.parse(localStorage.getItem("mailBox"));

const UserSlice = createSlice({
    name: "user",
    initialState: {
        login: localStorageData ? localStorageData.login : false,
        token: localStorageData ? localStorageData.token : "",
        userInfo: localStorageData ? localStorageData.userInfo : "",
        userDetails: {},
    },


    reducers: {

       loginSuccess (state, action) {
         state.login = true;
         state.token = action.payload.token;
         state.userInfo = action.payload.userInfo;

         localStorage.setItem("mailBox", JSON.stringify({
            login: true,
            token: action.payload.token,
            userInfo: action.payload.userInfo
         }));
       },

       loginFailed (state, action) {
        state.login = false;
        state.token = "";
        state.userInfo = "";
       },

       updateProfilePic (state, action) {
        if(state.userDetails) {
          state.userDetails.profilePic = action.payload;
        }
       },

       updateUserName (state, action) {
         if(state.userDetails) {
          state.userDetails.name = action.payload;
         }
       }, 

       getUserSuccess (state, action) {
        state.userDetails = action.payload.findUser
       },

       logoutSuccess (state, action) {
        state.login = false;
        state.token = "";
        state.userInfo = "";
        state.userDetails = {};
        
        localStorage.removeItem("mailBox");
        
       },
    }
    
});




export const {loginSuccess , loginFailed, logoutSuccess, getUserSuccess, updateProfilePic, updateUserName} = UserSlice.actions;




export default UserSlice;