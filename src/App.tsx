import NavBar from "./components/NavBar/NavBar"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import AddEventPage from "./pages/AddEventPage/AddEventPage"

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addEvent" element={<AddEventPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
