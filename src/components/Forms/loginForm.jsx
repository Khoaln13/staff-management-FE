// src/LoginForm.js
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { loginAccount } from '../../redux/apiRequest';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate()

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
