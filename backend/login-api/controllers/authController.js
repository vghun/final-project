// controllers/authController.js
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "full_name, email và password là bắt buộc" });
    }

    // check email tồn tại
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length) return res.status(400).json({ message: "Email đã tồn tại" });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await pool.query("INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)", [
      full_name,
      email,
      phone || null,
      password_hash,
    ]);

    res.status(201).json({ message: "User created (for testing)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "email và password là bắt buộc" });

    const [rows] = await pool.query("SELECT id, full_name, email, phone, password_hash FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT id, full_name, email, phone, created_at FROM users WHERE id = ?", [userId]);
    if (!rows.length) return res.status(404).json({ message: "User không tồn tại" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
