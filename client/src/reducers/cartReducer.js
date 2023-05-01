// slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: { cart: [], cartOpen: false },
    reducers: {
        //payload must be a product object (destructured from action)
        addToCart: (state, { payload }) => {
            state.cart.push(payload)
            state.cartOpen = true
        },
        //payload must be a product id
        removeFromCart: (state, { payload }) => {
            const newCart = state.cart.filter((product) => {
                return product._id !== payload;
            });
            state.cart = newCart
            state.cartOpen = newCart.length > 0
        },
        //payload must be an array of products
        addMultipleToCart: (state, { payload }) => {
            state.cart = [...state.cart, ...payload]
        },
        //payload must be an object with _id and purchaseQuantity properties
        updateCartQuantity: (state, { payload }) => {
            const { _id, purchaseQuantity } = payload

            state.cart = state.cart.map((product) => {
                if (_id === product._id) {
                    product.purchaseQuantity = purchaseQuantity;
                }
                return product;
            })
        },
        //no payload necessary
        clearCart: state => {
            state.cart = []
            state.cartOpen = false
        },
        //no payload necessary
        toggleCart: state => {
            state.cartOpen = !state.cartOpen
        }
    },
});

export const { addToCart, addMultipleToCart, removeFromCart, updateCartQuantity, clearCart, toggleCart } = cartSlice.actions;
export default cartSlice.reducer;