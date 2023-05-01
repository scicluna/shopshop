// React imports
import React, { useEffect } from 'react';
// Stripe import
import { loadStripe } from '@stripe/stripe-js';
// gql import for useLazyQuery
import { useLazyQuery } from '@apollo/client';
// gql string import
import { QUERY_CHECKOUT } from '../../utils/queries';
// idb handler
import { idbPromise } from '../../utils/helpers';
// Cart Item component
import CartItem from '../CartItem';
// Auth import
import Auth from '../../utils/auth';

// // useStoreContext hook import
// import { useStoreContext } from '../../utils/GlobalState';
// // action import (just strings)
// import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';

import { useDispatch, useSelector } from 'react-redux';
import { toggleCart, addMultipleToCart } from '../../reducers/cartReducer';

// import css to use with the cart
import './style.css';

// creates a stripePromise ????
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  // grab state and dispatch from the store context
  // const [state, dispatch] = useStoreContext();

  const { cart, cartOpen } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  // useLazyQuery doesn't immediately call the query, but getCheckout will call the query
  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  // useEffect that triggers when we get data from the query (aka, getCheckout() is called)
  useEffect(() => {
    // if we have data, resolve the stripe promise with their sessionId and a redirect to checkout
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  // useEffect that triggers when the state.cart.length or dispatch changes
  useEffect(() => {
    // async function
    async function getCart() {
      // get the cart from ibDB
      const indexedCart = await idbPromise('cart', 'get');
      // dispatch that cart into the global context
      // dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });

      dispatch(addMultipleToCart(indexedCart))
    }

    // if the state's cart is empty, get cart
    if (!cart.length) {
      getCart();
    }
  }, [cart, dispatch]);

  // function to dispatch the toggle_cart reducer function
  function toggleCartButton() {
    // dispatch({ type: TOGGLE_CART });
    dispatch(toggleCart())
  }

  // calculates the total price of the cart
  function calculateTotal() {
    let sum = 0;
    cart.forEach((item) => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  // push all of the product id's in the cart into productIds array and then use that array with getCheckout query
  function submitCheckout() {
    const productIds = [];

    cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds },
    });
  }

  // if the cart isn't open, display a cart
  if (!cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCartButton}>
        <span role="img" aria-label="trash">
          🛒
        </span>
      </div>
    );
  }

  // if cart is open, display jsx
  return (
    <div className="cart">
      <div className="close" onClick={toggleCartButton}>
        [close]
      </div>
      <h2>Shopping Cart</h2>
      {/* if we have something in our cart... */}
      {cart.length ? (
        <div>
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>

            {Auth.loggedIn() ? (
              <button onClick={submitCheckout}>Checkout</button>
            ) : (
              <span>(log in to check out)</span>
            )}
          </div>
        </div>
      ) : (
        <h3>
          <span role="img" aria-label="shocked">
            😱
          </span>
          You haven't added anything to your cart yet!
        </h3>
      )}
    </div>
  );
};

export default Cart;
