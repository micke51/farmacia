const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password requeridos" });
  }

  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ? AND is_active = 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en login", error: error.message });
  }
};

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, 'cliente', 1)",
      [full_name, email, password_hash]
    );

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar", error: error.message });
  }
};