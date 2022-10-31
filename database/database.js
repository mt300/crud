const Sequelize = require("sequelize");
const connection = new Sequelize('crud','root','clarinha',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;