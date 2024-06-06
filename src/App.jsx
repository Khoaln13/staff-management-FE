
import { Routes, Route, Navigate } from 'react-router-dom'
import ResponsiveAppBar from "./components/appBar/appBar"
// import StaffList from "./components/staffComponents/staffList"
import StaffInfo from './components/staffComponents/staffInfomation/staffInfo'
import LoginForm from './components/Forms/loginForm'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import RequestSolution from './components/requestSolution/RequestSolution'
import ListStaff from './components/staffComponents/ListStaffs/ListStaffs'

function App() {
  const user = useSelector((state) => state.auth.login.currentUser)
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && user && <ResponsiveAppBar />}

      <Routes>
        {user ? (
          <>
            {/* <Route path="/staffs" element={<StaffList />} /> */}
            <Route path="/staffs" element={<ListStaff />} />
            <Route path="/staff/:id" element={<StaffInfo />} />
            <Route path="/solve-request" element={<RequestSolution />} />
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <Route path="/" element={<Navigate to="/login" />} />
        )}


        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </>
  )
}

export default App
