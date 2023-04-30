// React imports
import React from 'react';
import { Link } from 'react-router-dom';
// gql useQuery import
import { useQuery } from '@apollo/client';
// query_user import (gql string)
import { QUERY_USER } from '../utils/queries';


function OrderHistory() {
  // initializes the data from our QUERY_USER (the current user)
  const { data } = useQuery(QUERY_USER);

  //set user to data.user if data came back not nullish
  let user;
  if (data) {
    user = data.user;
  }

  //return jsx
  return (
    <>
      <div className="container my-1">
        <Link to="/">← Back to Products</Link>

        {/* conditional on whether or not user is null */}
        {user ? (
          <>
            <h2>
              Order History for {user.firstName} {user.lastName}
            </h2>
            {user.orders.map((order) => (
              <div key={order._id} className="my-2">
                <h3>
                  {new Date(parseInt(order.purchaseDate)).toLocaleDateString()}
                </h3>
                <div className="flex-row">
                  {order.products.map(({ _id, image, name, price }, index) => (
                    <div key={index} className="card px-1 py-1">
                      <Link to={`/products/${_id}`}>
                        <img alt={name} src={`/images/${image}`} />
                        <p>{name}</p>
                      </Link>
                      <div>
                        <span>${price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
}

export default OrderHistory;
