import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Register({ onSwitch }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('لطفاً همه فیلدها را پر کنید!')
      return
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند!')
      return
    }
    if (password.length < 4) {
      setError('رمز عبور باید حداقل ۴ کاراکتر باشد!')
      return
    }
    const success = register(username.trim(), password.trim())
    if (!success) {
      setError('این نام کاربری قبلاً ثبت شده است!')
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 ثبت‌نام</h2>
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
          placeholder="رمز عبور (حداقل ۴ کاراکتر)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="تکرار رمز عبور"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition text-lg font-semibold">
          ثبت‌نام
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        قبلاً ثبت‌نام کرده‌اید؟{' '}
        <button onClick={onSwitch} className="text-indigo-600 font-semibold hover:underline">
          ورود
        </button>
      </p>
    </div>
  )
}

export default Register