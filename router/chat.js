const express = require('express');
const router = express.Router();
const { verifyToken } = require('../jwt/token');
const ChatController = require('../controllers/ChatController');

router.post('/createchat', verifyToken, ChatController.createChat);
router.get('/listchat', ChatController.listaChat);


module.exports = router;
