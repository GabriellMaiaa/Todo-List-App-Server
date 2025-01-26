import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SECRET || "maiagg123";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("Header Authorization:", authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado." });
    }
    return res.status(401).json({ error: "Token inválido." });
  }
}
