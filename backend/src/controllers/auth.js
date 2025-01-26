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

      // Verifique se o nome e a senha foram passados
      if (!name || !password) {
        return res
          .status(400)
          .json({ error: "Name and password are required." });
      }

      console.log("Received name:", name); // Verifique se o nome foi recebido corretamente
      console.log("Received password:", password); // Verifique se a senha foi recebida corretamente (não exibir senha em produção)

      // Buscar o usuário no banco de dados
      const user = await prisma.user.findUnique({ where: { name } });

      // Verifique se o usuário foi encontrado
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      console.log("User found:", user); // Verifique os dados do usuário encontrado no banco

      // Comparar a senha fornecida com o hash armazenado no banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Se a senha não for válida
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      console.log("Password is valid");

      // Gerar o token JWT
      const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });

      console.log("Generated Token:", token); // Verifique o token gerado

      // Enviar o token na resposta
      return res.json({ message: "Login successful!", token });
    } catch (error) {
      console.error("Login error:", error); // Imprime o erro completo no console

      // Em caso de erro inesperado, retorne um erro 500
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}
