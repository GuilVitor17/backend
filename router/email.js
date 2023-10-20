const express = require('express');
const router = express.Router();
const emailController = require('../controllers/EmailController'); // Substitua pelo caminho correto do controlador

// Rota para iniciar o pagamento
router.post('/enviar-email', emailController.enviarEmail);


module.exports = router;
