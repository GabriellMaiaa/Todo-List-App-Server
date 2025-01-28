import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TodoListHandler {
  static async createTask(req, res) {
    try {
      const { task, description, userId } = req.body;

      if (!task || !userId) {
        return res
          .status(400)
          .json({ error: "Task and userId are mandatory." });
      }

      // Verifica se o usuário existe
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Cria a task associada ao usuário
      const newTask = await prisma.list.create({
        data: {
          task,
          description,
          userId, // Alteração: Inserindo userId diretamente
        },
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error.message, error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
  static async getTasks(req, res) {
    const todos = await prisma.list.findMany();
    return res.json(todos);
  }
  static async getUser(req, res) {
    const { userId } = req.params;
    const task = await prisma.list.findUnique({
      where: { userId },
    });

    return res.json(task);
  }

  static async getTaskById(req, res) {
    try {
      const { id } = req.params;

      const task = await prisma.list.findUnique({
        where: { id },
      });

      if (!task) {
        return res.status(404).json({ message: "Tarefa não encontrada" });
      }

      return res.json(task);
    } catch (error) {
      console.error("Erro ao buscar task por ID:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
  static async getTasksByUser(req, res) {
    try {
      const { userId } = req.params;

      // Verifica se o userId foi passado
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      // Verifica se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
      }

      const tasks = await prisma.list.findMany({
        where: { userId },
      });

      // Retorna as tasks do usuário
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  static async updateTaskById(req, res) {
    const { id } = req.params;
    const { task } = req.body;

    const todo = await prisma.list.update({
      where: { id },
      data: { task },
    });

    return res.json(todo);
  }
  static async updateTaskCompletedById(req, res) {
    const { id } = req.params;
    const { completed } = req.body;

    const todo = await prisma.list.findUnique({ where: { id } });
    if (!todo) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    const updatedTodo = await prisma.list.update({
      where: { id },
      data: { completed },
    });

    return res.json(updatedTodo);
  }
  static async deleteTaskById(req, res) {
    const { id } = req.params;

    await prisma.list.delete({ where: { id } });
    return res.status(204).send();
  }
}
