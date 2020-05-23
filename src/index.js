import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import authReducer from './state/Reducers';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import express from 'express';
 
const app = express();
 
app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);

const store = createStore(authReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
