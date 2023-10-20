const { v4: uuidv4 } = require('uuid');
const Item = require('../models/item');



// Cria tarefa 
async function createItem(req, res){

    const user_id = req.user.user_id;
  
    try {
      const { name, description } = req.body;
      const Id = uuidv4();
  
  
      const item = await Item.create({
        id: Id,
        name,
        description,
        user_id
      });
  
      res.json({ message: 'Item criado com sucesso!', item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao criar .' });
    }
  };
  


// listar tarefas 
  async function listItems(req, res){
  
    const user_id = req.user.user_id;
  
    try {
      const item = await Item.findAll({
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
  
  
// async function getItemById(req, res){
  
//     const user_id = req.user.user_id;
//     const ItemId = req.params.id;
  
  
//     try {
//       const item = await Item.findOne({
//         where: {
//           user_id: user_id,
//           id: ItemId
//         },
//       });
  
//       if (!item) {
//         return res.status(404).json({ message: 'Item não encontrado.' });
//       }
//       res.json({ item });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erro ao buscar o item.' });
//     }
//   };
  
  
// async function updateItem(req, res){
//     const user_id = req.user.user_id;
//     const idItem = req.params.id; // Get the item ID from req.params
//     const { name, description } = req.body;
  
//     try {
//       // Find the item to update
//       const item = await Item.findOne({
//         where: {
//           user_id: user_id,
//           id: idItem
//         },
//       });
  
//       if (!item) {
//         return res.status(404).json({ message: 'Item não encontrado.' });
//       }
  
//       // Update the item in the database
//       const [updatedRowCount] = await Item.update(
//         {
//           name,
//           description
//         },
//         {
//           where: {
//             id: idItem // Use the ID from req.params to specify the item to update
//           }
//         }
//       );
  
//       if (updatedRowCount === 1) {
//         console.log('Item editado com sucesso.');
//         res.json({ message: 'Item editado com sucesso', updatedRowCount }); // Return a JSON success response
//       } else {
//         res.status(500).json({ message: 'Erro ao editar o item no banco de dados.' }); // Return a JSON error response
//       }
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Erro ao buscar o item.' });
//     }
//   };
  

// Apagar tarefa 

  async function deleteItem(req, res) {
    const user_id = req.user.user_id;
    const idItem = req.params.id; // Get the item ID from req.params
  
    try {
      // Find the item to delete
      const item = await Item.findOne({
        where: {
          user_id: user_id,
          id: idItem
        },
      });
  
      if (!item) {
        return res.status(404).json({ message: 'Item não encontrado.' });
      }
  
      // Delete the item from the database
      const deletedRowCount = await Item.destroy({
        where: {
          id: idItem // Use the ID from req.params to specify the item to delete
        }
      });
  
      if (deletedRowCount === 1) {
        console.log('Item excluído com sucesso.');
        res.json({ message: 'Item excluído com sucesso' }); // Return a JSON success response
      } else {
        res.status(500).json({ message: 'Erro ao excluir o item no banco de dados.' }); // Return a JSON error response
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar o item.' });
    }
  };
  
  
  module.exports = {
    createItem,
    listItems,
    deleteItem,
  };
  
  
  
  
  
  
  