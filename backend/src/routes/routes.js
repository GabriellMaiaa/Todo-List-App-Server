import { Router } from "express";
import { TodoListHandler } from "../controllers/list";
import { AuthHandler } from "../controllers/auth";

const router = Router();

// Rotas de autenticação
router.post("/register", AuthHandler.register);
router.post("/login", AuthHandler.login);

router.post("/task/create", TodoListHandler.createTask);
router.get("/", TodoListHandler.getTasks);
router.get("/task/:id", TodoListHandler.getTaskById);
router.get("/task/user/:userId", TodoListHandler.getTasksByUser);
router.put("/task/edit/:id", TodoListHandler.updateTaskById);
router.patch("/task/completed/:id", TodoListHandler.updateTaskCompletedById);
router.delete("/task/delete/:id", TodoListHandler.deleteTaskById);

export default router;
