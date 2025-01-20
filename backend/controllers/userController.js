import User from "../models/User.js";
import bcrypt from 'bcrypt';

const getAllUsers = async (req, res) => {
    try {

        
        if (req.user && (req.user.role == 'user')) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const users = await User.findAll();
        return res.json(users);
    }
    catch (error) {
        console.error('Got an error when fetching users: ', error);
        return res.status(500).json({ error: 'Failed to fetch the users' });
    }
}

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user && (req.user.role !== 'admin' && req.user.id !== parseInt(userId, 10))) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Failed to fetch user' });
    }
};

const createUser = async (req, res) => {
    console.log('req.user', req.user);
    try {
        const isAdmin = (req.user.role === 'admin'); // If req.user is undefined, assume admin

        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { username, password, role, managerId } = req.body;

        if (role === 'user' && managerId) {
            const manager = await User.findByPk(managerId);
            if (!manager || manager.role !== 'manager') {
                 return res.status(400).json({ error: 'Invalid manager ID' });
        }
      }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            managerId
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { username, password, role, managerId } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        user.username = username || user.username;
        user.role = role || user.role;
        user.managerId = managerId !== undefined ? managerId : user.managerId;

        await user.save();
        return res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Failed to delete user' });
    }
};

export {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};