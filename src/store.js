import { configureStore } from '@reduxjs/toolkit';
import monitorReducerEnhancer from './enhancers/monitorReducer';
import loggerMiddleware from './middlewares/logger';
import rootReducer from './reducers';

export default function configureAppStore(preloadedState) {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(loggerMiddleware),
        preloadedState,
        enhancers: (getDefaultEnhancers) => [monitorReducerEnhancer, ...getDefaultEnhancers()],
    });

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
    }

    store.subscribe(() => {
        // Persist the state to localStorage on state changes
        localStorage.setItem('roomId', JSON.stringify(store.getState().room.roomId));
        localStorage.setItem('user', JSON.stringify(store.getState().user.user));
        localStorage.setItem('logs', JSON.stringify(store.getState().room.logs));
    });

    return store;
}
