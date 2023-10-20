const express = require('express');
const router = express.Router();
const DadosController = require('../controllers/dadosControllers');
const { verifyToken } = require('../jwt/token');


router.post('/dados', verifyToken, DadosController.createDataItem);
router.get('/dados', verifyToken, DadosController.getDataItems);
router.put('/dados/:id', verifyToken, DadosController.updateDataItem);

module.exports = router;