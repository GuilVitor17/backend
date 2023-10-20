const sequelize = require('../config/db'); 
const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Importe a função v4 do pacote 'uuid'


const Item = sequelize.define('items', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(), // Use a função uuidv4() para gerar um UUID padrão
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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

module.exports = Item;
