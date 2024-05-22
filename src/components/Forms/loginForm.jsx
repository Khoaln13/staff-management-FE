// src/LoginForm.js
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { loginAccount } from '../../redux/apiRequest';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../redux/createInstance';
import { logOut } from '../../redux/apiRequest';
import { logoutSuccess } from '../../redux/authSlice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                padding: 2,
            }}
        >
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    Đăng nhập
                </Typography>
                {/* {error && (
                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                        {error}
                    </Alert>
                )} */}
                <TextField
                    label="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: 2, width: '300px' }}
                />
                <TextField
                    label="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: 2, width: '300px' }}
                />
                <Button variant="contained" type="submit" sx={{ width: '300px' }}>
                    Đăng nhập
                </Button>
            </Box>
        </Box>
    );
}

export default LoginForm;
