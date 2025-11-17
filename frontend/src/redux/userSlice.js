import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name:'user',
  initialState:{
    userData : null,
    currentCity: null,
    currentState:null,
    currentAddress:null,
    shopInMyCity:[],
    itemsInMyCity:[]
  },
  reducers:{
    setUserData:(state, action) => {
      state.userData = action.payload;
    },
    setCity : (state, action) => {
      state.currentCity = action.payload;
    },
    setState :(state, action)=>{
      state.currentState = action.payload;
    },
    setAddress : (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopInMyCity:(state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity:(state, action) => {
      state.itemsInMyCity = action.payload;
    }
  }
})

export const {setUserData, setCity, setState, setAddress, setShopInMyCity, setItemsInMyCity} = userSlice.actions;

export default userSlice.reducer;