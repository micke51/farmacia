require("dotenv").config();
const db = require("./src/db");

(async () => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    console.log("✅ Conectado OK:", rows[0]);
    process.exit(0);
  } catch (e) {
    console.error("❌ Error DB:", e.message);
    process.exit(1);
  }
})();
