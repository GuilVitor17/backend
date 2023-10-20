const sequelize = require('../config/db'); 
const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Importe a função v4 do pacote 'uuid'


const User = sequelize.define('usuarios', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(), // Use a função uuidv4() para gerar um UUID padrão
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING, // Defina o tipo de dados da coluna como STRING
      allowNull: false,
    },
  });

  module.exports = User;
