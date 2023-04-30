// React imports
import React, { useEffect } from 'react';
// Apollo import to utilize gql mutations
import { useMutation } from '@apollo/client';
// Jumbotron component import
import Jumbotron from '../components/Jumbotron';
// ADD_ORDER mutation import (gql string)
import { ADD_ORDER } from '../utils/mutations';
// ibdPromise function to handle the internal store
import { idbPromise } from '../utils/helpers';

// Success Page
function Success() {
  // initialize our ADD_ORDER mutation for use
  const [addOrder] = useMutation(ADD_ORDER);

  // use effect that runs whenever addOrder changes (never)?
  useEffect(() => {
    // wrap our code in async so we can perform async functions
    async function saveOrder() {
      // gets our data from the cart Store in our IndexedDB
      const cart = await idbPromise('cart', 'get');
      // maps over the cart for the item._id's of the products
      const products = cart.map((item) => item._id);

      // if products are an array... (if there are products in the cart)
      if (products.length) {
        // adds a new order to the user object global state using context and variables: products
        const { data } = await addOrder({ variables: { products } });
        const productData = data.addOrder.products;

        // loops over the products in the order and deletes them from the cart
        productData.forEach((item) => {
          idbPromise('cart', 'delete', item);
        });
      }
      // after 3s routes the user back to '/' 
      setTimeout(() => {
        window.location.assign('/');
      }, 3000);
    }

    // calls saveOrder()
    saveOrder();
  }, [addOrder]);

  //return simple jsx wrapped in our jumbotron component
  return (
    <div>
      <Jumbotron>
        <h1>Success!</h1>
        <h2>Thank you for your purchase!</h2>
        <h2>You will now be redirected to the home page</h2>
      </Jumbotron>
    </div>
  );
}

export default Success;
