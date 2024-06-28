import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { randomizeUsername } from '../reducers/userReducer';

const useUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const error = useSelector((state) => state.user.error);

    useEffect(() => {
        if (!user) {
            dispatch(randomizeUsername());
        }
    }, [dispatch, user]);

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
