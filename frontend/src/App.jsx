import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import LoginSignup from './pages/LoginSignup'
import Home from './pages/Home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in on app load
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedInStatus)

    // Listen for storage changes (when logged in/out from another tab or component)
    const handleStorageChange = () => {
      const status = localStorage.getItem('isLoggedIn') === 'true'
      setIsLoggedIn(status)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <LoginSignup setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/home"
          element={isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
