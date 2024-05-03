import NavBar from "./components/NavBar/NavBar"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import AddEventPage from "./pages/AddEventPage/AddEventPage"
import EventPage from "./pages/EventPage/EventPage"
import UpdateEventPage from "./pages/UpdateEventPage/UpdateEventPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage"
import { useState } from "react"
import Authentication from "./utils/authentication"

function App() {
  const authentication = new Authentication()
  
  const [isConnected, setIsConnected] = useState(authentication.isConnected())
  
  return (
    <>
      <BrowserRouter>
        <NavBar isConnected={isConnected} setIsConnected={setIsConnected} />
        <Routes>
          <Route path="/" element={<HomePage authentication={authentication} />} />
          <Route path="/registration" element={<RegistrationPage authentication={authentication} />} />
          <Route path="/login" element={<LoginPage setIsConnected={setIsConnected} authentication={authentication} />} />
          <Route path="/addEvent" element={<AddEventPage />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/updateEvent/:id" element={<UpdateEventPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
