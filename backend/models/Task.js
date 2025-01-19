const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
        defaultValue: 'OPEN',
        allowNull: false
    },
    assignedUserId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: true
    },
    managerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'managerId'
        },
        allowNull: false
    }
}, {
    timestamps: true,
});

module.exports = Task;
