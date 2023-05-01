import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/productsReducer'
import cartReducer from './reducers/cartReducer'
import categoriesReducer from './reducers/categoriesReducer'

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        categories: categoriesReducer
    }
})

export default store