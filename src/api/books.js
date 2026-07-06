// src/api/books.js
import axios from 'axios'

const API_URL = 'http://localhost:3000/books'

export const fetchBooks = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

export const addBook = async (newBook) => {
  const response = await axios.post(API_URL, newBook)
  return response.data
}

export const updateBook = async ({ id, ...updates }) => {
  const response = await axios.put(`${API_URL}/${id}`, updates)
  return response.data
}

export const deleteBook = async (id) => {
  await axios.delete(`${API_URL}/${id}`)
  return id
}