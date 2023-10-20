const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/payplayController'); // Substitua pelo caminho correto do controlador
const { verifyToken } = require('../jwt/token');

// Rota para iniciar o pagamento
router.get('/iniciar-pagamento', paypalController.iniciarPagamento);

// Rota de retorno após o pagamento bem-sucedido
router.get('/sucesso/:paymentId/:PayerID', verifyToken, paypalController.sucessoPagamento);

// Rota de cancelamento de pagamento
router.get('/cancelado', paypalController.pagamentoCancelado);

// Rota para listar transações do usuário
router.get('/aulastrue', verifyToken, paypalController.listarTransacoes);

module.exports = router;
