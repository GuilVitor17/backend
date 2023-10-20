const sequelize = require('../config/db'); 
const { Sequelize, DataTypes } = require('sequelize');

const Transacoes = sequelize.define('transacoes', {
    id: {
      type: Sequelize.UUID, // Use Sequelize.UUID para IDs UUID
      defaultValue: Sequelize.UUIDV4, // Defina um valor padrão como UUIDV4
      primaryKey: true,
      allowNull: false,
    },
    paypal_transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    payer: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    transactions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
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

  module.exports = Transacoes;
