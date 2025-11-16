import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";

interface UserState {
    currentUser: User | null;
    loading: boolean;
    error: string | { message: string } | null;
}

const initialState: UserState = {
        currentUser:null,
        loading:false,
        error:null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        signInSuccess:(state,action : PayloadAction<User>)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        signInFailure:(state,action : PayloadAction<string>)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateStart:(state)=>{
            state.error = null;
            state.loading = true;
        },
        updateSuccess:(state,action : PayloadAction<User>)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        updateFailure:(state,action : PayloadAction<string>)=>{
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart:(state )=>{
            state.error = null;
            state.loading = true;
        },
        deleteUserSuccess:(state,action : PayloadAction<User>)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        deleteUserFailure:(state,action : PayloadAction<string>)=>{
            state.error = action.payload;
            state.loading = false;
        }, 
        signOutFailure:(state,action : PayloadAction<string>)=>{
            state.error = action.payload;
            state.loading = false;
        },    
        signOutSuccess:(state)=>{
            state.currentUser = null,
            state.error = null,
            state.loading = false
        }   
    }
});

export const {signInStart,signInSuccess,signInFailure,updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserFailure,deleteUserSuccess,signOutSuccess,signOutFailure} = userSlice.actions;
export default userSlice.reducer;