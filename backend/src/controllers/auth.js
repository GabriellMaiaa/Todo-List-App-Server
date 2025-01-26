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

  static async login(req, res) {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return res
          .status(400)
          .json({ error: "Name and password are required." });
      }

      const user = await prisma.user.findUnique({ where: { name } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(password, user.password); // Verifique as senhas
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET, // Usando o segredo armazenado no .env
        { expiresIn: "1h" }
      );

      return res.json({ message: "Login successful!", token });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
