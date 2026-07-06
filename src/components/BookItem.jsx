import React from 'react'
import { Link } from 'react-router-dom'

const BookItem = React.memo(({ 
  book, 
  editingId, 
  editTitle, 
  editAuthor, 
  setEditTitle, 
  setEditAuthor, 
  onEditSubmit, 
  onCancelEdit, 
  onToggleRead, 
  onDelete, 
  onStartEdit,
  isUpdating,
  isDeleting 
}) => {
  if (editingId === book.id) {
    return (
      <div className={`bg-white p-4 rounded-xl shadow-sm border-r-4 ${book.read ? 'border-green-500' : 'border-gray-300'}`}>
        <form onSubmit={(e) => onEditSubmit(e, book.id)} className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="عنوان..."
            autoFocus
            className="w-full px-4 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
            placeholder="نویسنده..."
            className="w-full px-4 py-2 border-2 border-indigo-500 rounded-lg focus:outline-none"
          />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50" disabled={isUpdating}>
              {isUpdating ? '⏳...' : '💾 ذخیره'}
            </button>
            <button type="button" className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition" onClick={onCancelEdit}>
              ❌ انصراف
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border-r-4 ${book.read ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div className="flex-1">
          <Link to={`/books/${book.id}`} className="block group">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
              {book.title}
              <span className="ml-2 text-lg">{book.read ? '✅' : '⬜'}</span>
            </h3>
          </Link>
          <p className="text-gray-600">✍️ {book.author}</p>
          <p className="text-sm text-gray-500 mt-1">
            📂 {book.category === 'programming' ? '💻 برنامه‌نویسی' :
                book.category === 'novel' ? '📖 رمان' :
                book.category === 'science' ? '🔬 علمی' :
                book.category === 'history' ? '🏛️ تاریخ' : '📚 سایر'}
          </p>
          <p className={`text-sm font-semibold mt-1 ${book.read ? 'text-green-600' : 'text-gray-500'}`}>
            {book.read ? '📖 خوانده شده' : '📕 نخوانده'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            📅 اضافه شده: {new Date(book.dateAdded).toLocaleDateString('fa-IR')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onStartEdit(book)} className="px-3 py-1.5 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition text-sm">
            ✏️ ویرایش
          </button>
          <button
            onClick={() => onToggleRead(book.id)}
            className="px-3 py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm disabled:opacity-50"
            disabled={isUpdating}
          >
            {book.read ? '📕 نخوانده' : '📖 خوانده شده'}
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? '⏳...' : '🗑️ حذف'}
          </button>
        </div>
      </div>
    </div>
  )
})

export default BookItem