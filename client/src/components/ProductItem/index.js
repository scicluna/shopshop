// React imports
import React from "react";
import { Link } from "react-router-dom";
//import pluralize utils function
import { pluralize } from "../../utils/helpers"
// import useStoreContext hook to access global state
import { useStoreContext } from "../../utils/GlobalState";
// import actions (strings)
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
// idb handler
import { idbPromise } from "../../utils/helpers";

function ProductItem(item) {
  // grab global state and dispatch
  const [state, dispatch] = useStoreContext();

  // destructure image, name, _id, price, and quantity from item
  const {
    image,
    name,
    _id,
    price,
    quantity
  } = item;

  // destructure cart from state
  const { cart } = state

  // add to cart function 
  const addToCart = () => {
    // find the passed in ITEM inside of the cart
    const itemInCart = cart.find((cartItem) => cartItem._id === _id)
    // if you find the item... dispatch it and update the cart quantity
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: _id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      // also update the idb
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      // else, add the item to the cart with a quantity of 1
      dispatch({
        type: ADD_TO_CART,
        product: { ...item, purchaseQuantity: 1 }
      });
      idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
    }
  }

  //return simple jsx
  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default ProductItem;
