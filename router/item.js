const express = require('express');
const router = express.Router();
const { verifyToken } = require('../jwt/token');
const itemController = require('../controllers/itemControllers');

router.post('/item', verifyToken, itemController.createItem);

router.get('/listitem', verifyToken, itemController.listItems);

// router.get('/listitem/:id', verifyToken, itemController.getItemById);

// router.put('/item/:id', verifyToken, itemController.updateItem);

router.delete('/item/:id', verifyToken, itemController.deleteItem);


module.exports = router;
