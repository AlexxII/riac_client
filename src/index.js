import React from 'react';
import { mainUrl } from './mainconfig'

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import * as serviceWorker from './serviceWorker';
import { cache } from './cache'

import App from './containers/App/App';

// const cache = new InMemoryCache()

const client = new ApolloClient({
  uri: mainUrl + '/graphql',
  cache,
  credentials: 'include',
  connectToDevTools: true
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>

      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();