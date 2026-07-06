import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import HomePage from './pages/HomePage'
import AddBookPage from './pages/AddBookPage'
import BookDetailPage from './pages/BookDetailPage'

function App() {
  const { user, logout } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        {isLogin ? (
          <Login onSwitch={() => setIsLogin(false)} />
        ) : (
          <Register onSwitch={() => setIsLogin(true)} />
        )}
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-2xl font-bold">📚 کتابخانه من</h1>
            <nav className="flex gap-4">
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/20 transition">🏠 خانه</Link>
              <Link to="/add" className="px-4 py-2 rounded-lg hover:bg-white/20 transition">➕ افزودن کتاب</Link>
            </nav>
            <div className="flex items-center gap-4">
              <span className="bg-white/20 px-4 py-2 rounded-full">👤 {user.username}</span>
              <button onClick={logout} className="bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition">
                🚪 خروج
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddBookPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App