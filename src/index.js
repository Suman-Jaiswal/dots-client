import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureAppStore from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const persistedState = localStorage.getItem('reduxState')
    ? JSON.parse(localStorage.getItem('reduxState'))
    : {};

const store = configureAppStore(persistedState);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
