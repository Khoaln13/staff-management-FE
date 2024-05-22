import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../redux/apiRequest';
import { createAxios } from '../../redux/createInstance';
import { logoutSuccess } from '../../redux/authSlice';

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const location = useLocation();
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const userId = currentUser?.user._id; // Khai báo userId ở đây
    const accessToken = currentUser?.accessToken;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);
    const handleLogout = () => {
        logOut(dispatch, userId, navigate, accessToken, axiosJWT)
    }
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const staffPage = userId ? { name: 'Thông tin cá nhân ', path: `/staff/${userId}` } : null;
    const allStaffsPage = currentUser.user.role_id.name === 'admin' ? { name: 'Nhân viên', path: '/staffs' } : null
    const requestSolve = currentUser.user.role_id.name === 'admin' ? { name: 'Xử lý yêu cầu', path: '/solve-request' } : null
    const pages = [
        { name: 'Trang chủ', path: '/' },
        allStaffsPage,
        staffPage,
        requestSolve,
    ].filter(page => page !== null);

    const settings = [
        { name: 'Profile', path: '/profile' },
        { name: 'Account', path: '/account' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Logout', onClick: handleLogout },
    ];

    return (
        <AppBar position="static" sx={{ background: 'linear-gradient(to bottom, rgba(3, 11, 252, 0.7), rgba(3, 11, 252, 0.2))' }}>
            <Container maxWidth="xl" >
                <Toolbar disableGutters>
                    {/* logo khi rộng */}
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    {/* menu chọn trang khi thu nhỏ */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={handleCloseNavMenu}

                                >
                                    <Typography
                                        component={Link}
                                        to={page.path}
                                        textAlign="center"
                                        variant="body1"
                                    >
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    {/* logo khi thu nhỏ */}
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    {/* button chọn trang khi mở rộng */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={Link}
                                to={page.path}
                                onClick={() => {
                                    handleCloseNavMenu();
                                }}
                                sx={{
                                    my: 2,
                                    color: '#0a0a0a',
                                    display: 'block',
                                    '&:hover': {
                                        color: 'white', // Màu chữ khi di chuột vào
                                    },
                                    '&.Mui-selected': {
                                        color: 'white', // Màu chữ khi MenuItem được chọn
                                    },
                                }}
                                className={location.pathname === page.path ? 'Mui-selected' : ''}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {/* avatar chọn chức năng */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: "2px solid", borderColor: "white" }}>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={setting.onClick || handleCloseUserMenu}>
                                    <Typography component={Link} to={setting.path} textAlign="center" variant="body1">
                                        {setting.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar >
    );
}
export default ResponsiveAppBar;