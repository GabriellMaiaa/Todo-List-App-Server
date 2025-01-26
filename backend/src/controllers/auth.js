import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthHandler {
  static async register(req, res) {
    try {
      const { name, password, jobTitle } = req.body;

      if (!name || !password || !jobTitle) {
        return res
          .status(400)
          .json({ error: "Name and password are required." });
      }

      const existingUser = await prisma.user.findFirst({ where: { name } });
      if (existingUser) {
        return res.status(400).json({ error: "Name is already taken." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
          jobTitle,
        },
      });

      return res
        .status(201)
        .json({ message: "User successfully registered!", user });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async login(req, res) {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required." });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { name },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      // Gera o token JWT após o login bem-sucedido
      const token = jwt.sign(
        { userId: user.id }, // Armazena o ID do usuário no token
        process.env.JWT_SECRET, // Segredo para assinatura do JWT
        { expiresIn: "1h" } // Tempo de expiração do token
      );

      return res.json({
        message: "Login successful!",
        token, // Retorna o token gerado
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
