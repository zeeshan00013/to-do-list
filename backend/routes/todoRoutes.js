const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/todoControllers");

router.use(authMiddleware);

router.get("/", getTodos);
router.post("/add", addTodo);
router.delete("/delete/:id", deleteTodo);
router.put("/update/:id", updateTodo);

module.exports = router;
