import { Router } from "express"
import { TaskController } from "@/interfaces/controllers/task-controller"
import { authMiddleware } from "@/middleware/auth-middleware"

const router = Router()
const taskController = new TaskController()

// All task routes require authentication
router.use(authMiddleware)

router.post("/", taskController.createTask)
router.get("/", taskController.getTasks)
router.get("/stats", taskController.getTaskStats)
router.get("/:id", taskController.getTaskById)
router.put("/:id", taskController.updateTask)
router.delete("/:id", taskController.deleteTask)

export { router as taskRoutes }
