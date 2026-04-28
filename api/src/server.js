const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);



// ✅ endpoint de prueba
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows[0].ok });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));
