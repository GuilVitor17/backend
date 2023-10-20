const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const secretKey = 'jduuyfgrgrhgvfywtwftdfwghvewwre'; // Troque por uma chave secreta real e segura
const User = require('../models/user');
const { generateToken, verifyToken, tokenMap } = require('../jwt/token');
sgMail.setApiKey(`${process.env.KEY_SENDGRID}`);



// Criar usuario no banco.
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Hash da senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUUID = uuidv4();

    // Crie o usuário no banco de dados
    const user = await User.create({
      id: newUUID,
      username,
      password: hashedPassword,
      email
    });

    res.json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar usuário.' });
  }
};


// verificar se ususario existe, se exitir. faz o login.
const loginUser = async (req, res) => {
  const { password, email } = req.body;
  try {
    // Encontre o usuário com base no nome de usuário
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
    const token = jwt.sign({ user_id: user.id }, secretKey, { expiresIn: '1h' });

    // Verifique a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    res.json({ message: 'Login bem-sucedido!', user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};

// geração de token para editar senha
function generateResetToken() {
  return crypto.randomBytes(4).toString('hex');
}



// configuração da api do sendgrid para enviar email
const sendTokenEmail = (email, token) => {
  const msg = {
    to: email,
    from: 'contatofelplataforma@gmail.com', // esse email é padrão que fiz a integrçaõ do key da api.(Obrigatorio)
    subject: 'Redefinição de Senha',
    text: `Seu token de redefinição de senha é: ${token}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email enviado com sucesso');
    })
    .catch((error) => {
      console.error('Erro ao enviar o email:', error);
    });
};



// rota para envio de token para email
const generatePasswordResetToken = (req, res) => {
  const { email } = req.body;

  try {

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    // Exemplo de uso
    const emailParaRedefinirSenha = email;
    const token = generateResetToken();
    tokenMap.set(email, token);

    // Simule o envio do email
    sendTokenEmail(emailParaRedefinirSenha, token);

    console.log('Token gerado:', token);
    return res.status(200).json({ message: `Email enviado com sucesso - esse é seu Codigo [${token}]` });
  } catch (error) {
    return res.status(500).json({ message: `Impossivel enviar e-mail` });

  }

};


// ediçao de senha, com o token gerado
const updatePassword = async (req, res) => {
  const { email, newPassword, token } = req.body;

  try {
    if (!email || !newPassword || !token) {
      return res.status(400).json({ message: 'Email, token e nova senha são obrigatórios.' });
    }

    const storedToken = tokenMap.get(email);
    if (token !== storedToken) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashedPassword });
    tokenMap.delete(email)
    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar a senha.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  generatePasswordResetToken,
  updatePassword,
};
