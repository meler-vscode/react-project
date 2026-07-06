// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

// 1️⃣ ساخت Context
const AuthContext = createContext()

// 2️⃣ Provider (تامین‌کننده داده)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // بارگذاری کاربر از localStorage هنگام شروع
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // تابع ورود
  const login = (username, password) => {
    // بررسی وجود کاربر در localStorage
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const foundUser = savedUsers.find(
      (u) => u.username === username && u.password === password
    )

    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('user', JSON.stringify(foundUser))
      return true
    }
    return false
  }

  // تابع ثبت‌نام
  const register = (username, password) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    
    // بررسی اینکه کاربر قبلاً ثبت‌نام نکرده باشد
    if (savedUsers.find((u) => u.username === username)) {
      return false // کاربر وجود دارد
    }

    const newUser = { id: Date.now(), username, password }
    const updatedUsers = [...savedUsers, newUser]
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return true
  }

  // تابع خروج
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3️⃣ Hook سفارشی برای استفاده آسان
export function useAuth() {
  return useContext(AuthContext)
}