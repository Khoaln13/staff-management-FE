
import { Routes, Route, Navigate } from 'react-router-dom'
import ResponsiveAppBar from "./components/appBar/appBar"
import StaffList from "./components/staffComponents/staffList"
import StaffInfo from './components/staffComponents/staffInfo'
import LoginForm from './components/Forms/loginForm'
import { useSelector } from 'react-redux'
import Home from './components/home/Home'

function App() {
  const user = useSelector((state) => state.auth.login.currentUser)


  return (
    <>

      {user && <ResponsiveAppBar />}

      <Routes>
        {user ? (
          <>
            <Route path="/staffs" element={<StaffList />} />
            <Route path="/staff/:id" element={<StaffInfo />} />
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
