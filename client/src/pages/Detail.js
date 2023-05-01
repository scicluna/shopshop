// React imports
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// useQuery import for gql
import { useQuery } from '@apollo/client';
// component import
import Cart from '../components/Cart';


// useStoreContext hook import so we can access the store context
// import { useStoreContext } from '../utils/GlobalState';
// import four actions which are just strings (not gql) -- just dispatch types
// import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY, ADD_TO_CART, UPDATE_PRODUCTS, } from '../utils/actions';

// redux implementation
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateCartQuantity, addToCart } from '../reducers/cartReducer';
import { updateProducts } from '../reducers/productsReducer';


// import QUERY_PRODCUTS (a gql string)
import { QUERY_PRODUCTS } from '../utils/queries';
// import idbPromise to handle our indexDB
import { idbPromise } from '../utils/helpers';
// import spinner image
import spinner from '../assets/spinner.gif';

function Detail() {
  // grab state and dispatch from our useStoreContext hook
  // const [state, dispatch] = useStoreContext();

  const { cart } = useSelector(state => state.cart)
  const products = useSelector(state => state.products)
  const dispatch = useDispatch()

  // set id equal to the "id" param in our url
  // useParams() is a cool react hook
  const { id } = useParams();

  // set the current product state to an empty object
  const [currentProduct, setCurrentProduct] = useState({});

  // grab a loading state and the data from our gql useQuery(QUERY_PRODUCTS)
  //  Note: QUERY_PRODUCTS will work without variables, as it will return all products if no variables are provided
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // grab products and cart from the current state of useStoreContext
  // const { products, cart } = state;

  useEffect(() => {
    // already in global store
    // if we can get products from our global state, we set the current product to the one that matches the param id
    if (products.length) {
      setCurrentProduct(products.find((product) => product._id === id));
    }
    // retrieved from server
    // if we have data from the useQuery, we dispatch that to the global state reducer
    else if (data) {
      // dispatch({
      //   type: UPDATE_PRODUCTS,
      //   products: data.products,
      // });

      dispatch(updateProducts({ products: data.products }))

      // then we edit the products Store in our IndexedDB
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // tries to get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        // dispatch({
        //   type: UPDATE_PRODUCTS,
        //   products: indexedProducts,
        // });

        dispatch(updateProducts({ products: indexedProducts }))
      });
    }
    // run whenever products, data, loading, dispatch, or id change
  }, [products, data, loading, dispatch, id]);

  // handles adding a product into the cart
  const addItemToCart = () => {
    // finds a cart item who's ID matches the param's id
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
    // if we have that item...
    if (itemInCart) {
      // we update its quantity by +1
      // dispatch({
      //   type: UPDATE_CART_QUANTITY,
      //   _id: id,
      //   purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      // });

      dispatch(updateCartQuantity({ _id: id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }))

      // we update its quantity by +1 in ibd aswell...
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1,
      });
    } else {
      // or else we add one to the cart
      // dispatch({
      //   type: ADD_TO_CART,
      //   product: { ...currentProduct, purchaseQuantity: 1 },
      // });

      dispatch(addToCart({ ...currentProduct, purchaseQuantity: 1 }))

      // and to the idb cart store
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };

  // handles removing an item from the cart
  const removeItemfromCart = () => {
    // removes the current product from the cart
    // dispatch({
    //   type: REMOVE_FROM_CART,
    //   _id: currentProduct._id,
    // });

    dispatch(removeFromCart(currentProduct._id))

    // removes that item from the cart store
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  // return jsx
  return (
    <>
      {/* If we have a currentProduct and a cart return... */}
      {currentProduct && cart ? (
        <div className="container my-1">
          <Link to="/">← Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addItemToCart}>Add to Cart</button>
            <button
              disabled={!cart.find((p) => p._id === currentProduct._id)}
              onClick={removeItemfromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {/* If we're loading, display the spinner */}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
