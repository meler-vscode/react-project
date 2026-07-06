import React, { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBooks, addBook, updateBook, deleteBook } from '../api/books'
import BookItem from './BookItem'

function BookApp() {
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('programming')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')

  const { data: books = [], isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  })

  const addMutation = useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      setTitle('')
      setAuthor('')
      setCategory('programming')
      alert('✅ کتاب با موفقیت اضافه شد!')
    },
    onError: (error) => alert(`❌ خطا: ${error.message}`),
  })

  const updateMutation = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      setEditingId(null)
      alert('✅ کتاب با موفقیت ویرایش شد!')
    },
    onError: (error) => alert(`❌ خطا: ${error.message}`),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(['books'])
      alert('🗑️ کتاب حذف شد!')
    },
    onError: (error) => alert(`❌ خطا: ${error.message}`),
  })

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (filter === 'read') return book.read === true
        if (filter === 'unread') return book.read === false
        return true
      })
      .filter((book) => {
        if (categoryFilter === 'all') return true
        return book.category === categoryFilter
      })
      .filter((book) => {
        if (!search.trim()) return true
        const searchLower = search.toLowerCase().trim()
        return (
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower)
        )
      })
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
  }, [books, filter, categoryFilter, search])

  const handleAddBook = useCallback((e) => {
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
  }, [title, author, category, addMutation])

  const handleToggleRead = useCallback((id) => {
    const book = books.find(b => b.id === id)
    if (book) {
      updateMutation.mutate({ id, ...book, read: !book.read })
    }
  }, [books, updateMutation])

  const handleDeleteBook = useCallback((id) => {
    if (window.confirm('آیا از حذف این کتاب مطمئن هستید؟')) {
      deleteMutation.mutate(id)
    }
  }, [deleteMutation])

  const startEditing = useCallback((book) => {
    setEditingId(book.id)
    setEditTitle(book.title)
    setEditAuthor(book.author)
  }, [])

  const handleEditSubmit = useCallback((e, id) => {
    e.preventDefault()
    if (!editTitle.trim() || !editAuthor.trim()) {
      alert('لطفاً عنوان و نویسنده را وارد کنید!')
      return
    }
    const book = books.find(b => b.id === id)
    if (book) {
      updateMutation.mutate({ id, ...book, title: editTitle.trim(), author: editAuthor.trim() })
    }
  }, [books, editTitle, editAuthor, updateMutation])

  const cancelEditing = useCallback(() => setEditingId(null), [])

  if (isLoading) {
    return <div className="text-center text-2xl text-indigo-600 py-20">⏳ در حال بارگذاری...</div>
  }

  if (error) {
    return <div className="text-center text-2xl text-red-600 py-20">❌ خطا: {error.message}</div>
  }

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="🔍 جستجوی کتاب یا نویسنده..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-lg mb-6 focus:border-indigo-500 focus:outline-none transition"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm mb-6">
        <label className="font-bold text-gray-600">📂 دسته‌بندی:</label>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">همه</option>
          <option value="programming">💻 برنامه‌نویسی</option>
          <option value="novel">📖 رمان</option>
          <option value="science">🔬 علمی</option>
          <option value="history">🏛️ تاریخ</option>
          <option value="other">📚 سایر</option>
        </select>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          className={`px-5 py-2 rounded-lg transition ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setFilter('all')}
        >
          همه
        </button>
        <button 
          className={`px-5 py-2 rounded-lg transition ${filter === 'read' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setFilter('read')}
        >
          📖 خوانده شده
        </button>
        <button 
          className={`px-5 py-2 rounded-lg transition ${filter === 'unread' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setFilter('unread')}
        >
          📕 نخوانده
        </button>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddBook} className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="عنوان کتاب..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="نویسنده..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          >
            <option value="programming">💻 برنامه‌نویسی</option>
            <option value="novel">📖 رمان</option>
            <option value="science">🔬 علمی</option>
            <option value="history">🏛️ تاریخ</option>
            <option value="other">📚 سایر</option>
          </select>
          <button 
            type="submit" 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? '⏳...' : '📥 افزودن'}
          </button>
        </div>
      </form>

      {/* Book List */}
      <div className="space-y-3">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg py-10">📭 هیچ کتابی پیدا نشد!</p>
        ) : (
          filteredBooks.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              editingId={editingId}
              editTitle={editTitle}
              editAuthor={editAuthor}
              setEditTitle={setEditTitle}
              setEditAuthor={setEditAuthor}
              onEditSubmit={handleEditSubmit}
              onCancelEdit={cancelEditing}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteBook}
              onStartEdit={startEditing}
              isUpdating={updateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default BookApp