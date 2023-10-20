const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(`${process.env.KEY_SENDGRID}`);




// Envio de mensagem para email com api do SendGrid
async function enviarEmail(req, res) {

  const { destinatario, assunto, corpo } = req.body;

  if (!destinatario || !assunto || !corpo) {
    return res.status(400).json({ mensagem: 'Campos obrigatórios não preenchidos.' });
  }

  const email = {
    to: destinatario,
    from: 'contatofelplataforma@gmail.com', // esse email é padrão que fiz a integrçaõ do key da api.(Obrigatorio)
    subject: assunto,
    html: corpo,
  };

  sgMail
    .send(email)
    .then(() => {
      console.log('Email enviado com sucesso.');
      return res.status(200).json({ mensagem: 'Email enviado com sucesso.', email });
    })
    .catch((error) => {
      console.error('Erro ao enviar o email:', error);
      return res.status(500).json({ mensagem: 'Erro ao enviar o email.' });
    });

};

module.exports = { enviarEmail };
