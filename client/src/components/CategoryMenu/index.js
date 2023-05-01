// React import
import React, { useEffect } from 'react';
// useQuery for gql
import { useQuery } from '@apollo/client';

// // get our global context useStoreContext hook
// import { useStoreContext } from '../../utils/GlobalState';
// // import action strings
// import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';

import { useSelector, useDispatch } from 'react-redux';
import { updateCategories, updateCurrentCategory } from '../../reducers/categoriesReducer';

// import QUERY_CATEGORIES gqlstring
import { QUERY_CATEGORIES } from '../../utils/queries';
// import idb handler
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  // grab state and dispatch from global state
  // const [state, dispatch] = useStoreContext();

  const { categories } = useSelector(state => state.categories)
  const dispatch = useDispatch()

  // destructure out state.categories
  // const { categories } = state;


  // loading and categoryData (RENAMED FROM DATA APPARENTLY) destructured from our useQuery(QUERY_CATEGORIES)
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // useEffect that runs whenever categoryData, loading, or dispatch changes(dispatch wont change so)
  useEffect(() => {
    // if we have our data, use that data from useQuery and dispatch it to our global state
    if (categoryData && categoryData.length > 0) {
      // dispatch({
      //   type: UPDATE_CATEGORIES,
      //   categories: categoryData.categories,
      // });

      dispatch(updateCategories(categoryData.categories))

      // then update the categories store in idb
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
      // else if its not loading and we got no data from our query, try to pull the data from idb and dispatch it to global state
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        // dispatch({
        //   type: UPDATE_CATEGORIES,
        //   categories: categories,
        // });

        dispatch(updateCategories(categories))
      });
    }
  }, [categoryData, loading, dispatch]);

  // onclick dispastch UPDATE_CURRENT_CATEGORY to update our current category in the global state context
  const handleClick = (id) => {
    // dispatch({
    //   type: UPDATE_CURRENT_CATEGORY,
    //   currentCategory: id,
    // });

    dispatch(updateCurrentCategory(id))
  };


  // return jsx
  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
