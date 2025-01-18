const User = require('../models/User');

const UserController = {
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        }catch(error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        }catch(error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ error: 'User not found'});
            }
        }catch(error) {
            res.status(400).json({error: error.message});
        }
    },
};

module.exports = UserController;