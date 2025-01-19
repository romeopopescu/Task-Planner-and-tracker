const { Router } = require('express');
const TaskController = require('../controllers/TaskController');
const router = Router();

router.post('/tasks', TaskController.createTask);
router.get('/tasks', TaskController.getAllTasks);

module.exports = router;