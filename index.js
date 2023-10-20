require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const multer = require('multer');
// const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
// const sgMail = require('@sendgrid/mail');
// const { name } = require('ejs');
// const twilio = require('twilio');
// const stripe = require('stripe')('sk_test_51NHZaeJN9nASUegvBvlMNsXIh1YfT4xSq1ntpZqJBOdXn983cmimEn6Qos6OcTqOLZwpqvnqqrDwcUogwNxk2Re800t9LwmfXU'); // Substitua com sua chave secreta do Stripe
// const http = require('http');
// const socketIo = require('socket.io');
// const { Message } = require('twilio/lib/twiml/MessagingResponse');
// const paypal = require('paypal-rest-sdk');
const cors = require('cors')
const Authroutes = require('./router/user');
const Dadosroutes = require('./router/dados');
const Itemroutes = require('./router/item');
const Emailroutes = require('./router/email');
const Paypalroutes = require('./router/paypal')
const Chatroutes = require('./router/chat')
const Img = require('./models/image');
const { verifyToken } = require('./jwt/token');
const sequelize = require('./config/db');





const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(cors());
// const secretKey = 'seuSegredoSuperSecreto'; // Troque por uma chave secreta real e segura
const port = 3001;



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório onde os uploads serão salvos
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });


app.post('/upload', upload.single('imagem'), verifyToken, async (req, res) => {

  try {
    // Lê os dados da imagem do arquivo temporário
    const dadosImagem = fs.readFileSync(req.file.path);
    const nomeArquivo = `${uuidv4()}-${req.file.originalname}`;
    const caminhoImage = path.join(__dirname, 'uploads', nomeArquivo);
    const Id = uuidv4();

    fs.writeFileSync(caminhoImage, dadosImagem);

    const UrlImage = `${process.env.LOCAL_PORT}/${nomeArquivo}`;

    // Insere informações da imagem na tabela
    const saveImg = await Img.create({
      id: Id,
      name: UrlImage, // Salva o nome original da imagem
      tipo_mime: req.file.mimetype, // Salva o tipo MIME da imagem
      tamanho: req.file.size, // Salva o tamanho da imagem em bytes
      dados_imagem: dadosImagem, // Salva os dados binários da imagem
      user_id: req.user.user_id, // Substitua pelo usuário autenticado
    });

    // Remove o arquivo temporário após o upload
    fs.unlinkSync(req.file.path);

    console.log('Imagem inserida no banco de dados.');
    res.send({ 'Imagem inserida com sucesso': saveImg });
  } catch (err) {
    console.error('Erro ao inserir a imagem no banco de dados:', err);
    res.status(500).send('Erro ao inserir a imagem no banco de dados.');
  }
});


app.put('/edit-image/:id', upload.single('imagem'), verifyToken, async (req, res) => {
  const user_id = req.user.user_id;
  const imagemId = req.params.id;

  try {
    const image = await Img.findOne({
      where: {
        id: imagemId,
        user_id: user_id,
      },
    });

    if (!image) {
      return res.status(404).send('Imagem não encontrada!');
    }

    const dadosNovaImagem = fs.readFileSync(req.file.path);
    const NovonomeArquivo = `${uuidv4()}-${req.file.originalname}`;
    const caminhoImage = path.join(__dirname, 'uploads', NovonomeArquivo);

    fs.writeFileSync(caminhoImage, dadosNovaImagem);

    const UrlImage = `${process.env.LOCAL_PORT}/${NovonomeArquivo}`;

    // Use the updatedData variable to store the updated image data
    const updatedData = {
      name: UrlImage, // Salva o nome original da imagem
      tipo_mime: req.file.mimetype, // Salva o tipo MIME da imagem
      tamanho: req.file.size, // Salva o tamanho da imagem em bytes
      dados_imagem: dadosNovaImagem, // Salva os dados binários da imagem
    };

    // Update the image in the database and store the result
    const [rowsUpdated] = await Img.update(updatedData, {
      where: {
        id: imagemId,
      },
    });

    if (rowsUpdated === 1) {
      
      // Remove the temporary file after editing
      fs.unlinkSync(req.file.path);

      console.log('Imagem editada com sucesso.');
      // Send the updated image data in the response
      res.send({ message: 'Imagem editada com sucesso', updatedData });
    } else {
      res.status(500).send('Erro ao editar a imagem no banco de dados.');
    }
  } catch (err) {
    console.error('Erro ao editar a imagem no banco de dados:', err);
    res.status(500).send('Erro ao editar a imagem no banco de dados.');
  }
});


app.get('/imagens', verifyToken, async (req, res) => {

  const user_id = req.user.user_id;

  try {
    const img = await Img.findAll({
      where: {
        user_id: user_id,
      },
    });

    if (!img || img.length === 0) {
      return res.status(404).send('Imagem não encontrada.');
    }

    // Envie a imagem como resposta
    return res.status(200).json(img);

  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return res.status(500).send('Ocorreu um erro ao buscar a imagem.');
  }
});



app.use(Authroutes);
app.use(Dadosroutes);
app.use(Itemroutes);
app.use(Emailroutes);
app.use(Paypalroutes);
app.use(Chatroutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexão bem-sucedida com o banco de dados.');
    // Aqui você pode iniciar o servidor ou realizar outras ações após a conexão ser estabelecida.
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });

app.listen(process.env.PORT, () => {
  console.log(`${process.env.LOCAL_PORT}`);
});
