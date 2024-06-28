import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureAppStore from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));

const persistedState = {
    user: {
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    room: {
        roomId: JSON.parse(localStorage.getItem('roomId')) || null,
        logs: JSON.parse(localStorage.getItem('logs')) || [],
    },
};

const store = configureAppStore(persistedState);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
