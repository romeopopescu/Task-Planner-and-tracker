const { DataTypes } = require('sequelize')
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    uid: {
        type: DataTypes.STRING,
        unique: true,
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('user', 'manager', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },
    managerId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true,
    }
}, {
    timestamps: true,
});

module.exports = User;
