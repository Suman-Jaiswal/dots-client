const loggerMiddleware = (store) => (next) => (action) => {
    let result;
    console.log('\nLogger============>>>>>>>>>>>>>>>>');
    console.log('Dispatching:', action);
    if (action.type.includes('user')) {
        console.log('Previous state (user):', store.getState().user);
        result = next(action);
        console.log('Next state: (user)', store.getState().user);
    } else if (action.type.includes('room')) {
        console.log('Previous state (room):', store.getState().room);
        result = next(action);
        console.log('Next state: (room)', store.getState().room);
    } else if (action.type.includes('game')) {
        console.log('Previous state (game):', store.getState().game);
        result = next(action);
        console.log('Next state: (game)', store.getState().game);
    } else {
        result = next(action);
    }
    console.log('=================>>>>>>>>>>>>>>>>> \n');
    return result;
};

export default loggerMiddleware;
