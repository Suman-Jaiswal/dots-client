import { render } from '@testing-library/react';
import React from 'react';
import App from './App';
import { UserProvider } from './contexts/UserContext';

test('renders App component', () => {
    render(
        <UserProvider>
            <App />
        </UserProvider>
    );
});
