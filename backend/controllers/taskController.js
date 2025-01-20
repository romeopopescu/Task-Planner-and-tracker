import Task from '../models/Task.js';
import User from '../models/User.js';

const getAllTasks = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'manager') {
            tasks = await Task.findAll({
                include: [
                    {model: User, as: 'assignedUser'},
                    {model: User, as: 'manager'},
                ],
            });
        } else {
            tasks = await Task.findAll({
                where: {
                    assignedUserId: req.user.id,
                },
                include: [
                    {model: User, as: 'assignedUser'},
                    {model: User, as: 'manager'},
                ],
            });
        }
        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({error: 'Failed to fetch tasks'});
    }
};

const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findByPk(taskId, {
            include: [
                {model: User, as: 'assignedUser'},
                {model: User, as: 'manager'},
            ],
        });
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        if (req.user.role !== 'manager' && task.assignedUserId !== req.user.id) {
            return res.status(403).json({error: 'Forbidden'});
        }
        console.log('here');
        return res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({error: 'Failed to fetch task'});
    }
};

const createTask = async (req, res) => {
  try {
    if (req.user.role === 'manager') {
      const { description, assignedUserId } = req.body;
      const managerId = req.user.id;

      

      const newTask = await Task.create({
        description,
        assignedUserId,
        managerId,
       
      });
      return res.status(201).json(newTask);
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { description, assignedUserId, state} = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (req.user.role !== 'manager' && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.user.role === 'manager') {
      task.description = description || task.description;
     

      if (assignedUserId !== undefined) {
        const newAssignedUser = await User.findByPk(assignedUserId);
        if (!newAssignedUser || newAssignedUser.managerId !== req.user.id) {
          return res.status(403).json({ error: 'Forbidden: You can only assign tasks to users you manage.' });
        }
        task.assignedUserId = assignedUserId;
      }
      if (task.state === 'OPEN' && state === 'PENDING') {
        task.state = state;
      }

      if (state === 'CLOSED' && task.state === 'COMPLETED') {
        task.state = state;
        task.closedBy = req.user.id; 
        task.closedAt = new Date();
      }
    } else if (req.user.role === 'user') {
      if (state === 'PENDING' && task.state === 'OPEN') {
        console.log(state);
        console.log(task.state);
        task.state = state;
      }
      if (state === 'COMPLETED' && task.state === 'PENDING') {
        task.state = state;
      }
    }

    await task.save();
    console.log(task);
    return res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        if (req.user.role !== 'manager') {
            return res.status(403).json({error: 'Forbidden'});
        }

        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({error: 'Task not found'});
        }

        await task.destroy();
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({error: 'Failed to delete task'});
    }
};

const getTaskHistoryForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        
        if (req.user.role !== 'manager' && req.user.id !== parseInt(userId, 10)) {
            return res.status(403).json({error: 'Forbidden'});
        }

        const tasks = await Task.findAll({
            where: {
                assignedUserId: userId,
                state: 'CLOSED',
            },
            include: [
                {model: User, as: 'assignedUser'},
            ],
        });

        return res.json(tasks);
    } catch (error) {
        console.error('Error fetching task history:', error);
        return res.status(500).json({error: 'Failed to fetch task history'});
    }
};

export {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskHistoryForUser
};