const User = require('../models/User');
const Task = require('../models/Task');

const TaskController = {
    async getAllTasks(req, res) {
        try {
            let tasks;
            if (req.User.role === 'manager') {
                tasks = await Task.findAll();
            }
            else {
                tasks = await Task.findAll({
                    where: {
                        assignedUserId: req.User.id
                    }
                });
            }
            res.json(tasks);
        }catch(error) {
            res.status(500).json({ error: error.message });
        }
    },
    async createTask(req, res) {
        try {
            if (req.User.role === 'manager') {
              const { description, assignedUserId } = req.body;
              const managerId = req.managerId;
        
              //checking if user exists or is managed by manager
              const assignedUser = await User.findByPk(assignedUserId);
              if (!assignedUser || assignedUser.managerId !== managerId) {
                res.status(403).json({ error: 'Forbidden: You can only assign tasks to users you manage.' });
              }
        
              const task = await Task.create({
                description,
                assignedUserId,
                managerId,
                state: 'OPEN' 
              });
        

              res.status(201).json(task);
            } else {
              res.status(403).json({ error: 'Forbidden' });
            }
          } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
          }
    }
};

module.exports = TaskController;