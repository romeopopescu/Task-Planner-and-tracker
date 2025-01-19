const { Router } = require('express');
const UserController = require('../controllers/UserController');
const router = Router();

router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUser);

module.exports = router;