const express = require('express');
const router = express.Router();
const users = {
  registerUser,
  loginUser,
  generatePasswordResetToken,
  updatePassword,
} = require('../controllers/authControllers'); // Certifique-se de que o caminho para seus controladores esteja correto

// Rota para registro de usuário
router.post('/register', users.registerUser);

// Rota para fazer login
router.post('/login', users.loginUser);

// Rota para geração de token de redefinição de senha
router.post('/token-password', users.generatePasswordResetToken);

// Rota para atualização de senha
router.post('/update-password',users.updatePassword);

module.exports = router;
