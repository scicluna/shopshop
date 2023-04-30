//normal imports
const express = require('express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

//Apollo/mongo imports
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

//establish our port and express server
const PORT = process.env.PORT || 3001;
const app = express();

//start up our apollo server using the custom authMiddleware as a "context"
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

//boilerplate middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets
app.use('/images', express.static(path.join(__dirname, '../client/images')));

// Serve static HTML in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Serve the HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
