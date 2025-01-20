import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', 
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default sequelize;