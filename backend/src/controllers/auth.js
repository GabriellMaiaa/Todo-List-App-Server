import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "maiagg123";

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

      // const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          password,
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
  static async login(req, res) {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return res
          .status(400)
          .json({ error: "Name and password are required." });
      }

      const user = await prisma.user.findFirst({ where: { name } });

      if (!user) {
        return res.status(401).json({ error: "Invalid user." });
      }

      if (!user.password) {
        return res.status(401).json({ error: "Invalid password." });
      }

      const token = jwt.sign({ userId: user.id }, SECRET, {
        expiresIn: "1h",
      });

      // Enviar o token na resposta
      return res.json({ message: "Login successful!", token, userId: user.id });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
