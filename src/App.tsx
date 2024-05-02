import NavBar from "./components/NavBar/NavBar"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import AddEventPage from "./pages/AddEventPage/AddEventPage"
import EventPage from "./pages/EventPage/EventPage"
import UpdateEventPage from "./pages/UpdateEventPage/UpdateEventPage"
import LoginPage from "./pages/LoginPage/LoginPage"

function App() {
  return (
    <>
      <NavBar />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/addEvent" element={<AddEventPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/updateEvent/:id" element={<UpdateEventPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
