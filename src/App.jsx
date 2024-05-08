
import { Routes, Route } from 'react-router-dom'
import ResponsiveAppBar from "./components/appBar/appBar"
import StaffList from "./components/staffComponents/staffList"
import StaffInfo from './components/staffComponents/staffInfo'
import LoginForm from './components/Forms/loginForm'


function App() {


  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/staffs" element={<StaffList />} />
        <Route path="/staff/:id" element={<StaffInfo />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </>
  )
}

export default App
