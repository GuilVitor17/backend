const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const secretKey = 'jduuyfgrgrhgvfywtwftdfwghvewwre';

// Função para gerar um token JWT com base no usuário
function generateToken(user) {
  const payload = {
    user_id: user.id,
    username: user.username,
  };

  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expira em 1 hora
}

// Função para verificar o token JWT
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido.' });
  }
}

// Função para gerar um token aleatório
function generateRandomToken() {
  return crypto.randomBytes(4).toString('hex');
}

var tokenMap = new Map();


module.exports = {
  generateToken,
  verifyToken,
  generateRandomToken, 
  tokenMap
};
