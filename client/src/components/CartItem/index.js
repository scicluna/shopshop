// React import
import React from 'react';
// Bring in useStoreContext hook
import { useStoreContext } from "../../utils/GlobalState";
// Bring in some actions (strings)
import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../utils/actions";
// to handle our idb
import { idbPromise } from "../../utils/helpers";

const CartItem = ({ item }) => {
  // grab dispatch from useStoreContext
  const [dispatch] = useStoreContext();

  // handle removing an item from the cart updating the state
  const removeFromCart = item => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id
    });
    // deleted the item from the cart store aswell in the idb
    idbPromise('cart', 'delete', { ...item });
  };

  // handle the changing of item quantites
  const onChange = (e) => {
    const value = e.target.value;
    // if the quantity is 0, remove the item from the cart
    if (value === '0') {
      dispatch({
        type: REMOVE_FROM_CART,
        _id: item._id
      });
      // and delete the item from idb
      idbPromise('cart', 'delete', { ...item });

    } else {
      // else, update the cart quantity with the value
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: item._id,
        purchaseQuantity: parseInt(value)
      });
      // update the cart quantity in the idb
      idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });
    }
  }

  // return jsx
  return (
    <div className="flex-row">
      <div>
        <img
          src={`/images/${item.image}`}
          alt=""
        />
      </div>
      <div>
        <div>{item.name}, ${item.price}</div>
        <div>
          <span>Qty:</span>
          <input
            type="number"
            placeholder="1"
            value={item.purchaseQuantity}
            onChange={onChange}
          />
          <span
            role="img"
            aria-label="trash"
            onClick={() => removeFromCart(item)}
          >
            🗑️
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
