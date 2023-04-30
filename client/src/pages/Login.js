// React imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import useMutation for gql
import { useMutation } from '@apollo/client';
// import LOGIN mutation (gql string)
import { LOGIN } from '../utils/mutations';
// import Auth object
import Auth from '../utils/auth';

function Login(props) {
  // initializes our form state
  const [formState, setFormState] = useState({ email: '', password: '' });
  // initializes our LOGIN mutation and prepares us for error catching
  const [login, { error }] = useMutation(LOGIN);

  // async form submitter
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // tries to log the user in using their email and password
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      // if successful, we know we have a token so we Auth.login with the token
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  // handles the form state changing using destructured name and value from the e.target
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // returns jsx
  // fields should have required if they are required
  return (
    <div className="container my-1">
      <Link to="/signup">← Go to Signup</Link>

      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email address:</label>
          <input
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd">Password:</label>
          <input
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        {error ? (
          <div>
            <p className="error-text">The provided credentials are incorrect</p>
          </div>
        ) : null}
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
