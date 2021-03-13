const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('node-complete','root','namonamo',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;