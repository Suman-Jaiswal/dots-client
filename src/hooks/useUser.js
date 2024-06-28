import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { randomizeUsername } from '../reducers/userReducer';

const useUser = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (!user) {
            dispatch(randomizeUsername());
        }
    }, [dispatch, user]);

    useEffect(() => {
        console.log('UserProvider mounted');
    }, []);
    return;
};

export default useUser;
