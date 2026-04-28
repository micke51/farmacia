const jwt = require("jsonwebtoken");

exports.authRequired = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token requerido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // {id, role, email}
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

exports.onlyAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Requiere rol ADMIN" });
  }
  next();
};
