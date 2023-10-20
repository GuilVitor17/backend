const Dados = require('../models/dados');
const { v4: uuidv4 } = require('uuid');




// Criação dos dados de usuario, apos login 
async function createDataItem(req, res){

    const user_id = req.user.user_id;
  
    try {
      const { name, idade, sexo, cidade, telefone } = req.body;
      const Id = uuidv4();
  
  
      const item = await Dados.create({
        id: Id,
        name,
        idade,
        sexo,
        cidade,
        telefone,
        user_id
      });
  
      res.status(200).json({ message: 'Item criado com sucesso!', item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar .' });
    }
  };
  


  // listar dados de usuario 
  async function getDataItems(req, res){
  
    const user_id = req.user.user_id;
  
    try {
      const item = await Dados.findAll({
        where: {
          user_id: user_id,
        },
      });
  
      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }
      res.json({ item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar o item.' });
    }
  };
  
  

// Update dos dados de usuario, apos login 
  async function updateDataItem(req, res){
    const user_id = req.user.user_id;
    const idItem = req.params.id; 
    const { name, idade, sexo, cidade, telefone } = req.body;
  
  
    try {
      const item = await Dados.findOne({
        where: {
          user_id: user_id,
          id: idItem
        },
      });
  
      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }
  
      // Atualizar no banco de dados
      const [updatedRowCount] = await Dados.update(
        {
          name,
          idade,
          sexo,
          cidade,
          telefone
        },
        {
          where: {
            id: idItem // pegar o id do item para ser atualizado
          }
        }
      );
  
      if (updatedRowCount === 1) {
        console.log('Item editado com sucesso.');
        res.json({ message: 'Item editado com sucesso', updatedRowCount }); // Return a JSON success response
      } else {
        res.status(500).json({ message: 'Erro ao editar o item no banco de dados.' }); // Return a JSON error response
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar o item.' });
    }
  };

  module.exports = {
    createDataItem,
    getDataItems,
    updateDataItem
  };
  