// imports from apollo, our models, signToken, and... stripe?!?!?
const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

// declare resolvers
const resolvers = {

  // query resolvers
  Query: {
    // "categories" query -> finding all categories
    categories: async () => {
      return await Category.find();
    },

    // "products" query -> takes in a category and name
    products: async (parent, { category, name }) => {
      // empty params object
      const params = {};
      // fill params.category 
      if (category) {
        params.category = category;
      }
      // find products that have the matching category and/or part of the name
      if (name) {
        params.name = {
          $regex: name
        };
      }
      // find products that have the matching category or part of the name
      // can find all if nothing is passed in (INTERESTING)
      return await Product.find(params).populate('category');
    },

    // "product" query -> find a product by that product's ID
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },

    // "user" query -> retrieves a user's data and their orders with popualted product details
    user: async (parent, args, context) => {
      // if the user is authenticated, find the user by _id and populate the products and their categories
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });
        // sort the user's orders in descending order on purchase date
        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        //return the user object generated
        return user;
      }
      // if the user is not authenticated, throw an error
      throw new AuthenticationError('Not logged in');
    },

    // "order" query -> takes in an _id and checks for user authentication -> returns the specific order by _id
    order: async (parent, { _id }, context) => {
      // if authenticated...
      if (context.user) {
        // find the user by authentication _id and popualte their products and catetgories
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });
        // return specifically the order in question based on the _id
        return user.orders.id(_id);
      }
      // if not authenticated, return an error
      throw new AuthenticationError('Not logged in');
    },

    // "checkout" query -> handles the building of a new order, the navigation to that order, and the stripe processing of that order
    checkout: async (parent, args, context) => {
      // create new URL using the context header referer.origin ??????
      const url = new URL(context.headers.referer).origin;
      // build new order object with the products passed in as arguments
      const order = new Order({ products: args.products });

      // initialize line items
      const line_items = [];

      // grab the individual products details in an array from the new order object
      const { products } = await order.populate('products');

      // Loop over those products creating "stripe" objects and prices
      for (let i = 0; i < products.length; i++) {

        // create a stripe product object with the name, description, and image url
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`]
        });

        // create a stripe price object with its price in cents and currency
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: 'usd',
        });

        // add the stripe price object and quantity to the line_items array
        // stripe uses the price.id to look up all of the price and product details under the hood
        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      //creates a stripe checkout session with the payment method, line items, and redirecting urls
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      // returns an object with the stripe session id
      return { session: session.id };
    }
  },

  //declare mutations
  Mutation: {

    // "add user" mutation -> uses the arguments to create a new User
    addUser: async (parent, args) => {
      // create new user document
      const user = await User.create(args);
      // sign a new token for that user document
      const token = signToken(user);
      // return thaat user and its auth token
      return { token, user };
    },

    // "add order" mutation -> uses the products argument to build a new Order and the context to specify the user and make sure they are authenticated
    addOrder: async (parent, { products }, context) => {
      // if authenticated...
      if (context.user) {
        // build a new order using the products
        const order = new Order({ products });
        // update the users orders with the new orders
        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });
        // return that order
        return order;
      }
      // or throw an authentication error
      throw new AuthenticationError('Not logged in');
    },

    // "update user" mutation -> if the user is logged in, update them with new args
    updateUser: async (parent, args, context) => {
      // if they're logged in...
      if (context.user) {
        // return the user object with the new updates
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }
      // or throw an auth error
      throw new AuthenticationError('Not logged in');
    },

    // "update product" mutation -> Update the product's quantity by 1 and return the new product document
    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },

    // "login" mutation -> Take the username and password, look up the user, and compare the password hashes. If good, return that user and the jwt token
    login: async (parent, { email, password }) => {
      // find user via email
      const user = await User.findOne({ email });

      // if user isn't found, throw an error
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      // boolean check for whether or not the password is correct
      const correctPw = await user.isCorrectPassword(password);

      // if not correct, throw an error
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      //return user and jwt token
      const token = signToken(user);
      return { token, user };
    }
  }
};

module.exports = resolvers;
