import Bar from "./components/Bar/Bar"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"

function App() {
  return (
    <>
      <Bar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
