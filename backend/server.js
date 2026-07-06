const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== اتصال به MySQL =====
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookstore",
  charset: "utf8mb4"
});

// تست اتصال
db.connect((err) => {
  if (err) {
    console.log("❌ خطا در اتصال به MySQL:", err);
  } else {
    console.log("✅ اتصال به MySQL موفق!");
  }
});

// ===== 1️⃣ دریافت همه کتاب‌ها (GET) =====
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books ORDER BY id DESC", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در دریافت کتاب‌ها" });
    }
    res.json(result);
  });
});

// ===== 2️⃣ دریافت یک کتاب با ID (GET) =====
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در دریافت کتاب" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "کتاب یافت نشد" });
    }
    res.json(result[0]);
  });
});

// ===== 3️⃣ اضافه کردن کتاب (POST) =====
app.post("/books", (req, res) => {
  const { title, author, read = false, category = "programming", dateAdded } = req.body;

  console.log("📥 داده دریافت شده:", req.body);

  if (!title || !author) {
    return res.status(400).json({ error: "عنوان و نویسنده اجباری هستند!" });
  }

  const query = `
    INSERT INTO books (title, author, is_read, category, dateAdded) 
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [title, author, read, category, dateAdded || new Date().toISOString()],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "خطا در اضافه کردن کتاب" });
      }
      res.status(201).json({
        id: result.insertId,
        title,
        author,
        read,
        category,
        dateAdded: dateAdded || new Date().toISOString(),
      });
    }
  );
});

// ===== 4️⃣ ویرایش کتاب (PUT) =====
app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const { title, author, read, category } = req.body;

  console.log("📥 داده ویرایش:", req.body);

  if (!title || !author) {
    return res.status(400).json({ error: "عنوان و نویسنده اجباری هستند!" });
  }

  const query = `
    UPDATE books 
    SET title = ?, author = ?, is_read = ?, category = ? 
    WHERE id = ?
  `;
  db.query(query, [title, author, read, category, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در ویرایش کتاب" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "کتاب یافت نشد" });
    }
    res.json({ id, title, author, read, category });
  });
});

// ===== 5️⃣ حذف کتاب (DELETE) =====
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM books WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در حذف کتاب" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "کتاب یافت نشد" });
    }
    res.json({ message: "کتاب با موفقیت حذف شد" });
  });
});

// ===== راه‌اندازی سرور =====
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 سرور روی پورت ${PORT} اجرا شد!`);
  console.log(`📚 آدرس: http://localhost:${PORT}/books`);
});