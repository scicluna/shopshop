// import gql
import { gql } from '@apollo/client';

// query QUERY_PRODUCTS that searches out products by category
export const QUERY_PRODUCTS = gql`
  query getProducts($category: ID) {
    products(category: $category) {
      _id
      name
      description
      price
      quantity
      image
      category {
        _id
      }
    }
  }
`;

// query QUERY_CHECKOUT that takes in products and returns a session
export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ID]!) {
    checkout(products: $products) {
      session
    }
  }
`;

// query QUERY_ALL_PRODUCTS that displays all products and their categories
export const QUERY_ALL_PRODUCTS = gql`
  {
    products {
      _id
      name
      description
      price
      quantity
      category {
        name
      }
    }
  }
`;

// query QUERY_CATEGORIES that finds all categories
export const QUERY_CATEGORIES = gql`
  {
    categories {
      _id
      name
    }
  }
`;

// query QUERY_USER that finds the current user
export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          image
        }
      }
    }
  }
`;
