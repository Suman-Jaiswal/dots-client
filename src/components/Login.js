import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase';

const Login = () => {
    const onLogin = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h2>Please Login!</h2>
            <button onClick={onLogin}>Login</button>
        </div>
    );
};

export default Login;
