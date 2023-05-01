// React imports
import React, { useEffect } from 'react';
// component import
import ProductItem from '../ProductItem';

// // import globalstate hook
// import { useStoreContext } from '../../utils/GlobalState';
// // import a non-gql string (lol)
// import { UPDATE_PRODUCTS } from '../../utils/actions';

import { useSelector, useDispatch } from 'react-redux';
import { updateProducts } from '../../reducers/productsReducer';

// import gql
import { useQuery } from '@apollo/client';
// import the QUERY_PRODUCTS gql string
import { QUERY_PRODUCTS } from '../../utils/queries';
// import idb handler
import { idbPromise } from '../../utils/helpers';
// import spinner img
import spinner from '../../assets/spinner.gif';

function ProductList() {
  // grab state and dispatch from the global context
  // const [state, dispatch] = useStoreContext();

  const { currentCategory } = useSelector(state => state.categories)
  const products = useSelector(state => state.products)
  const dispatch = useDispatch()

  // destructure the current category from the global state
  // const { currentCategory } = state;

  // grab loading and data from our QUERY_PRODUCTS -- data is all of the products
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // useEffect that runs whenever data or loading changes
  useEffect(() => {
    // if data is loaded in...
    if (data) {
      // update our products in our global state to match...
      // dispatch({
      //   type: UPDATE_PRODUCTS,
      //   products: data.products,
      // });

      dispatch(updateProducts(data.products))

      // and update our idb
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
      // else... try to get the data and update our global state from idb
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        // dispatch({
        //   type: UPDATE_PRODUCTS,
        //   products: products,
        // });

        dispatch(updateProducts(products))
      });
    }
  }, [data, loading, dispatch]);


  function filterProducts() {
    // if there is no current categories, just return everything
    if (!currentCategory) {
      return products;
    }
    // if there is a current category, just return products with that category
    return products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  // return jsx
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
