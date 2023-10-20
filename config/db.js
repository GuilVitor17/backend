const { Sequelize, DataTypes } = require('sequelize');

// usando xampp
const sequelize = new Sequelize('node', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });


  
module.exports = sequelize;
