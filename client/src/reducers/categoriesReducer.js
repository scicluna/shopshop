// slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: { categories: [], currentCategory: '' },
    reducers: {
        //payload should be an array of categories
        updateCategories: (state, { payload }) => {
            state.categories = [...payload]
        },
        //payload should be a string (the current category)
        updateCurrentCategory: (state, { payload }) => {
            state.currentCategory = payload
        }
    },
});

export const { updateCategories, updateCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
