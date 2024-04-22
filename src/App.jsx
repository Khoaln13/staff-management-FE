
import { Routes, Route } from 'react-router-dom'
import ResponsiveAppBar from "./components/appBar/appBar"
import StaffList from "./components/staffComponents/staffList"



function App() {


  return (
    <>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/staffs" element={<StaffList />} />

      </Routes>
    </>
  )
}

export default App
