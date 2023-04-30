// React imports
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Apollo imports
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Component imports
import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Nav from './components/Nav';
import Success from './pages/Success';
import OrderHistory from './pages/OrderHistory';

// Context import
import { StoreProvider } from './utils/GlobalState';

// Set up gql link
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Middleware for the apollo client. Will edit the header of any gql request made. Controls user permissions to data.
const authLink = setContext((_, { headers }) => {
  // Checks local storage for the auth token
  const token = localStorage.getItem('id_token');

  // If we find the token, append it to the headers, otherwise set it to an empty string
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Setup our apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Wrap our application with the apollo provider so that it is accessable anywhere in our app
    // Wrap our application in storeProvider so that it has access to the store context
    // Use react router to define routes and corresponding pages that lay underneath the navbar
    <ApolloProvider client={client}>
      <Router>
        <div>
          <StoreProvider>
            <Nav />
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              <Route
                path="/success"
                element={<Success />}
              />
              <Route
                path="/orderHistory"
                element={<OrderHistory />}
              />
              <Route
                path="/products/:id"
                element={<Detail />}
              />
              <Route
                path="*"
                element={<NoMatch />}
              />
            </Routes>
          </StoreProvider>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
