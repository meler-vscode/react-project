import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBooks } from '../api/books'

function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })

  const book = books.find(b => b.id === parseInt(id))

  if (isLoading) {
    return <div className="text-center text-2xl text-indigo-600 py-20">⏳ در حال بارگذاری...</div>
  }

  if (error) {
    return <div className="text-center text-2xl text-red-600 py-20">❌ خطا: {error.message}</div>
  }

  if (!book) {
    return <div className="text-center text-2xl text-gray-500 py-20">📭 کتابی با این شناسه یافت نشد!</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/')} className="mb-6 px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
        ⬅️ بازگشت
      </button>
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{book.title}</h2>
        <div className="space-y-3 text-lg">
          <p><span className="font-semibold">✍️ نویسنده:</span> {book.author}</p>
          <p><span className="font-semibold">📂 دسته:</span> {book.category}</p>
          <p><span className="font-semibold">📖 وضعیت:</span> {book.read ? 'خوانده شده' : 'نخوانده'}</p>
          <p><span className="font-semibold">📅 اضافه شده:</span> {new Date(book.dateAdded).toLocaleDateString('fa-IR')}</p>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage