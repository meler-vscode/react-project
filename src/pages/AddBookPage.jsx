import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBook } from '../api/books'

function AddBookPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('programming')

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      navigate('/')
    },
    onError: (error) => alert(`❌ خطا: ${error.message}`),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) {
      alert('لطفاً عنوان و نویسنده را وارد کنید!')
      return
    }
    addMutation.mutate({
      title: title.trim(),
      author: author.trim(),
      read: false,
      category,
      dateAdded: new Date().toISOString(),
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📥 اضافه کردن کتاب جدید</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <input
          type="text"
          placeholder="عنوان کتاب..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="نویسنده..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        >
          <option value="programming">💻 برنامه‌نویسی</option>
          <option value="novel">📖 رمان</option>
          <option value="science">🔬 علمی</option>
          <option value="history">🏛️ تاریخ</option>
          <option value="other">📚 سایر</option>
        </select>
        <button 
          type="submit" 
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg font-semibold"
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? '⏳...' : '📥 افزودن کتاب'}
        </button>
      </form>
    </div>
  )
}

export default AddBookPage