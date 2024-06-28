import { configureStore } from '@reduxjs/toolkit';
import monitorReducerEnhancer from './enhancers/monitorReducer';
import loggerMiddleware from './middlewares/logger';
import rootReducer from './reducers';

const preloadedState = {
    user: {
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    room: {
        roomId: JSON.parse(localStorage.getItem('roomId')) || null,
        logs: JSON.parse(localStorage.getItem('logs')) || [],
    },
};

export default function configureAppStore() {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(loggerMiddleware),
        preloadedState,
        enhancers: (getDefaultEnhancers) =>
            process.env.NODE_ENV !== 'production'
                ? [monitorReducerEnhancer, ...getDefaultEnhancers()]
                : getDefaultEnhancers(),
        devTools: process.env.NODE_ENV !== 'production' && {
            name: 'Connect Dots Game',
            trace: true,
            traceLimit: 25,
            actionCreators: {
                room: {
                    clearLog: () => ({
                        type: 'room/clearLogs',
                        payload: null,
                    }),
                },
            },
        },
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
