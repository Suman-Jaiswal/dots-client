import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { randomizeUsername, setUser } from '../reducers/userReducer';

const useUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const error = useSelector((state) => state.user.error);

    useEffect(() => {
        const localUser = localStorage.getItem('user');
        if (localUser) {
            const parsedUser = JSON.parse(localUser);
            dispatch(setUser(parsedUser));
        } else {
            dispatch(randomizeUsername());
        }
    }, [dispatch]);

    useEffect(() => {
        console.log('UserProvider mounted');
    }, []);
    return {
        user,
        error,
        randomizeUsername,
    };
};

export default useUser;
