const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_planner_db', 'postgres', '1234', {
    host:'localhost',
    dialect:'postgres',
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('connection valid');
    } catch (error) {
        console.error('Unable to connect', error);
    }
})();

module.exports = sequelize;