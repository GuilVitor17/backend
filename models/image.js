const sequelize = require('../config/db'); 
const { Sequelize, DataTypes } = require('sequelize');


const Img = sequelize.define('dadosimgs', {
    id: {
      type: Sequelize.UUID, // Use Sequelize.UUID para IDs UUID
      defaultValue: Sequelize.UUIDV4, // Defina um valor padrão como UUIDV4
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING, // ou o tipo apropriado para o nome
      allowNull: false, // Permite que o campo seja nulo
    },
    data_upload: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    tipo_mime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tamanho: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dados_imagem: {
      type: DataTypes.BLOB('long'),
      allowNull: false,
    },
    user_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      references: {
        model: 'usuarios', // Substitua 'users' pelo nome da tabela de usuários
        key: 'id', // Substitua 'id' pela chave primária da tabela de usuários
      },
    },
  });

  module.exports = Img;
