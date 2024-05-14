// src/LoginForm.js
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { loginAccount } from '../../redux/apiRequest';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../redux/createInstance';
import { logOut } from '../../redux/apiRequest';
import { logoutSuccess } from '../../redux/authSlice';
// import { Link } from 'react-router-dom';
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const userId = currentUser?.user._id;
    const accessToken = currentUser?.accessToken;

    let axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);
    const handleLogout = () => {
        logOut(dispatch, userId, navigate, accessToken, axiosJWT)
    }
    useEffect(() => {
        if (currentUser) handleLogout()
    }, [])
    const handleLogin = (e) => {
        e.preventDefault();
        const newAccount = {
            username: username,
            password: password,
        }
        loginAccount(newAccount, dispatch, navigate);
    };

    return (
        <form onSubmit={handleLogin}>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button variant="contained" type="submit">Login</Button>
            {/* <Typography variant="body2">
                Chưa có tài khoản?{' '}
                <Link to="/register">
                    Đăng ký
                </Link>
            </Typography> */}
        </form>

    );
}

export default LoginForm;
