// const Pool = require('pg').Pool;

// const pool = new Pool({
//     user:"postgres",
//     host:"localhost",
//     database:"task_planner_db",
//     password:"1234",
//     port:5432,
// });

// module.exports = pool;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://localhost:5432/task_planner_db');

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

module.exports = sequelize;