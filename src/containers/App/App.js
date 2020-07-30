import React from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client';

import './App.scss';
import Router from '../Router'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router />
      </div>
    </ApolloProvider>
  );
}

export default App;
