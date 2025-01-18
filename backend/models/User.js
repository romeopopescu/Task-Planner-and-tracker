const { DataTypes } = require('sequelize')
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
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
        type: DataTypes.ENUM('user', 'manager'),
        allowNull: false,
        defaultValue: 'user',
    },
}, {
    timestamps: true,
});

module.exports = User;
