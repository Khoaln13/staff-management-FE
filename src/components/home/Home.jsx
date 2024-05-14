
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllDepartment, getAllPosition } from '../../redux/apiRequest';

function Home() {
    // Lấy thông tin người dùng từ Redux Store
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const userRole = currentUser ? currentUser.user.role_id?.name : 'Guest';
    const dispatch = useDispatch()
    useEffect(() => {
        getAllDepartment(dispatch);
        getAllPosition(dispatch);
    }, [])
    return (
        <>
            <h1>You are logging in with role {userRole}!</h1>
        </>
    );
}

export default Home;