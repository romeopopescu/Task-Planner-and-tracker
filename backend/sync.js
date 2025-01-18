const sequelize = require('./config/sequelize');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('connected')
        await sequelize.sync({ alter: true});
        console.log('sync successfull');
    }catch (error) {
        console.error('sync not successfull', error);
    }
    await sequelize.close();

})();