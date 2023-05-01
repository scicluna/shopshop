// slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: { products: [] },
  reducers: {
    //payload should be an array of products
    updateProducts: (state, { payload }) => {
      state.products = [...payload]
    }
  },
});

export const { updateProducts } = productsSlice.actions;
export default productsSlice.reducer;

//UPDATE_PRODUCTS