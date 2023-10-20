const { v4: uuidv4 } = require('uuid');
const Chat = require('../models/chat');


async function createChat(req, res) {

    try {
        const {name, description, urlImage} = req.body
        const user_id = req.user.user_id
        const Id = uuidv4()
    
        const saveMsg = await Chat.create({
            id:Id,
            name,
            description,
            urlImage,
            user_id
        })
    
        res.status(200).json(saveMsg)
    } catch (error) {

        console.log(error)
        res.status(401).send({erro:'deu um erro'})
        
    }

}

async function listaChat(req, res) {


  try {
    const msgs = await Chat.findAll();
  
    if (!msgs || msgs.length === 0) {
      return res.status(404).json({ message: 'Nenhuma mensagem encontrada.' });
    }
  
    res.json({ msgs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar as mensagens.' });
  }
}  
  
  

module.exports = 
{
createChat,
listaChat
}