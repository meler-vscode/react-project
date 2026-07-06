import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login({ onSwitch }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('لطفاً همه فیلدها را پر کنید!')
      return
    }
    const success = login(username.trim(), password.trim())
    if (!success) {
      setError('نام کاربری یا رمز عبور اشتباه است!')
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔐 ورود</h2>
      {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition text-lg font-semibold">
          ورود
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        حساب کاربری ندارید؟{' '}
        <button onClick={onSwitch} className="text-indigo-600 font-semibold hover:underline">
          ثبت‌نام
        </button>
      </p>
    </div>
  )
}

export default Login