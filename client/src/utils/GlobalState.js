// React imports + importing our custom reducer function
import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers'

// Creating our store context and destructuring the StoreContext.Provider component from it
const StoreContext = createContext();
const { Provider } = StoreContext;

// Store provider is a custom component that takes in props and grants access to all of its children 
// the state/dispatch from useProductReducer
const StoreProvider = ({ value = [], ...props }) => {
  const [state, dispatch] = useProductReducer({
    products: [],
    cart: [],
    cartOpen: false,
    categories: [],
    currentCategory: '',
  });

  // ...props encapsulates children and allows you to wrap up other jsx with StoreProvider.
  return <Provider value={[state, dispatch]} {...props} />;
};

// Custom hook for grabbing the store
const useStoreContext = () => {
  return useContext(StoreContext);
};

export { StoreProvider, useStoreContext };
