import { Router } from "express";
import { TodoListHandler } from "../controllers/list";
import { AuthHandler } from "../controllers/auth";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", AuthHandler.register);
router.post("/login", AuthHandler.login);

router.use(authMiddleware);

router.post("/task/create", TodoListHandler.createTask);
router.get("/", TodoListHandler.getTasks);
router.get("/task/:id", TodoListHandler.getTaskById);
router.get("/task/user/:userId", TodoListHandler.getTasksByUser);
router.put("/task/edit/:id", TodoListHandler.updateTaskById);
router.patch("/task/completed/:id", TodoListHandler.updateTaskCompletedById);
router.delete("/task/delete/:id", TodoListHandler.deleteTaskById);
router.get("user/:id");

export default router;
