import React from 'react';

import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import * as serviceWorker from './serviceWorker';
import { cache } from './cache'

import App from './containers/App/App';

const proDuctionUrl = process.env.REACT_APP_GQL_SERVER
const url = process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : proDuctionUrl

const client = new ApolloClient({
  uri: url + '/graphql',
  // cache,
  cache: new InMemoryCache(),
  credentials: 'include',
  connectToDevTools: true
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();