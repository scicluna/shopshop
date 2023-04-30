// React imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import useMutation for gql
import { useMutation } from '@apollo/client';
// import our Auth object
import Auth from '../utils/auth';
// import ADD_USER mutation (gql string)
import { ADD_USER } from '../utils/mutations';

function Signup(props) {
  // track the state of the form fields (email and password)
  const [formState, setFormState] = useState({ email: '', password: '' });
  // initialize addUser from useMutation(ADD_USER)
  const [addUser] = useMutation(ADD_USER);

  // async function that uses our ADD_USER mutation and passes in the email, password, firstname, and lastname as variables
  // should probably have had error handling
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        firstName: formState.firstName,
        lastName: formState.lastName,
      },
    });
    // takes the token, signs it, and logs the user in
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  // handles formState updating based on the targets name and value
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // jsx form return
  // fields should probably have "required" on them
  return (
    <div className="container my-1">
      <Link to="/login">← Go to Login</Link>

      <h2>Signup</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="flex-row space-between my-2">
          <label htmlFor="firstName">First Name:</label>
          <input
            placeholder="First"
            name="firstName"
            type="firstName"
            id="firstName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="lastName">Last Name:</label>
          <input
            placeholder="Last"
            name="lastName"
            type="lastName"
            id="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="email">Email:</label>
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
        <div className="flex-row flex-end">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
