const sequelize = require('../config/db'); 
const { Sequelize, DataTypes } = require('sequelize');


const Dados = sequelize.define('dados', {
    id: {
      type: Sequelize.UUID, // Use Sequelize.UUID para IDs UUID
      defaultValue: Sequelize.UUIDV4, // Defina um valor padrão como UUIDV4
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: { // Adicione a definição da coluna 'user_id' aqui
      type: Sequelize.UUID, // Use Sequelize.UUID para IDs UUID
      defaultValue: Sequelize.UUIDV4, // Defina um valor padrão como UUIDV4
      allowNull: false,
      references: {
        model: 'usuarios', // Substitua 'Users' pelo nome da tabela de usuários
        key: 'id', // Substitua 'id' pela chave primária da tabela de usuários
      },
    },
  });


module.exports = Dados;
