const db = require("../db");

exports.create = async (req, res) => {
  try {
    const {
      code,
      name,
      description,
      price,
      cost,
      unit,
      stock,
      stock_min,
      category_id,
      supplier_id,
      expiry_date
    } = req.body;

    if (!code || !name || price == null || !unit) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const [result] = await db.query(
      `
      INSERT INTO products
      (code, name, description, price, cost, unit, stock, stock_min, category_id, supplier_id, expiry_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        code,
        name,
        description || null,
        price,
        cost ?? null,
        unit,
        stock ?? 0,
        stock_min ?? 0,
        category_id ?? null,
        supplier_id ?? null,
        expiry_date || null
      ]
    );

    return res.status(201).json({
      message: "Producto creado correctamente",
      product_id: result.insertId
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ message: "Error al crear producto", error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, code, name, description, price, cost, unit,
        stock, stock_min, expiry_date, category_id, supplier_id,
        is_active, created_at, updated_at
      FROM products
      WHERE is_active = 1
      ORDER BY name ASC
    `);

    return res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ message: "Error al obtener producto", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      code,
      name,
      description,
      price,
      cost,
      unit,
      stock,
      stock_min,
      category_id,
      supplier_id,
      expiry_date,
      is_active
    } = req.body;

    const [result] = await db.query(
      `
      UPDATE products SET
        code = ?,
        name = ?,
        description = ?,
        price = ?,
        cost = ?,
        unit = ?,
        stock = ?,
        stock_min = ?,
        category_id = ?,
        supplier_id = ?,
        expiry_date = ?,
        is_active = ?
      WHERE id = ?
      `,
      [
        code,
        name,
        description ?? null,
        price,
        cost ?? null,
        unit,
        stock ?? 0,
        stock_min ?? 0,
        category_id ?? null,
        supplier_id ?? null,
        expiry_date ?? null,
        is_active ?? 1,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ message: "Error al actualizar producto", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("UPDATE products SET is_active = 0 WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto desactivado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};
