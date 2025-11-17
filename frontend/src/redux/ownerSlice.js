import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload;
    },
    addItemToShop: (state, action) => {
      if (state.myShopData) {
        state.myShopData.items.push(action.payload);
      }
    },
    updateShopItems: (state, action) => {
      if (state.myShopData) {
        state.myShopData.items = action.payload; 
      }
    },
  },
});

export const { setMyShopData, addItemToShop, updateShopItems } = ownerSlice.actions;
export default ownerSlice.reducer;
