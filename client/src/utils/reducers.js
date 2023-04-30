import { useReducer } from 'react';
import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from './actions';

// custom reducer for our various state change dispatches
export const reducer = (state, action) => {
  switch (action.type) {

    //case updates the products property of the state object using action.products
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };

    // case updates the cartOpen and cart properties of the state object using action.product
    case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.product],
      };

    // case adds multiple products to the cart (just like add to cart but with an extra spreader)
    case ADD_MULTIPLE_TO_CART:
      return {
        ...state,
        cart: [...state.cart, ...action.products],
      };

    // case updates the quantity of of products in a cart. It returns the state, cartOpen = true and 
    // then it updates cart by changing the product.purchaseQuantity  of a specific product id to the new
    // action.purchaseQuantity
    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map((product) => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        }),
      };

    // case removes a product from the cart by filtering it out based on action._id
    case REMOVE_FROM_CART:
      let newState = state.cart.filter((product) => {
        return product._id !== action._id;
      });
      // then it returns the state, the cartOpen status, and the new cart state
      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState,
      };

    // case clears out the cart array and sets cartOpen to false
    case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: [],
      };

    // case reverses (true/false) of cartOpen
    case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen,
      };

    // case updates the categories list with action.categories
    case UPDATE_CATEGORIES:
      return {
        ...state,
        categories: [...action.categories],
      };

    // case updates the current category with action.currentCategory
    case UPDATE_CURRENT_CATEGORY:
      return {
        ...state,
        currentCategory: action.currentCategory,
      };

    // just returns the state if none of the cases match
    default:
      return state;
  }
};

// custom hook that utilizes this reducer function and just expects an initial state to be passed in
export function useProductReducer(initialState) {
  return useReducer(reducer, initialState);
}
