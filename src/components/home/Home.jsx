
import { useSelector } from 'react-redux';

function Home() {
    // Lấy thông tin người dùng từ Redux Store
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const userRole = currentUser ? currentUser.user.role : 'Guest'; // Nếu không có người dùng, sử dụng "Guest"

    return (
        <>
            <h1>You are logging in with role {userRole}!</h1>
        </>
    );
}

export default Home;