const express = require("express");
const router = express.Router();

const controller = require("../controllers/products.controller");
const { authRequired, onlyAdmin } = require("../middlewares/auth.middleware");

// 📦 productos
router.get("/", authRequired, controller.getAll);
router.get("/:id", authRequired, controller.getById);

router.post("/", authRequired, onlyAdmin, controller.create);
router.put("/:id", authRequired, onlyAdmin, controller.update);
router.delete("/:id", authRequired, onlyAdmin, controller.remove);

module.exports = router;
