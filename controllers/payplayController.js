const paypal = require('paypal-rest-sdk');
const { v4: uuidv4 } = require('uuid');
const Transacoes = require('../models/transacoes');



// Configuraçoes do paypal 
paypal.configure({
    mode: `${process.env.PAYPAL_MODE}`, // Modo 'sandbox' para testar, 'live' para produção
    client_id: `${process.env.PAYPAL_CLIENT_ID}`, // Substitua pelo seu cliente ID do PayPal
    client_secret: `${process.env.PAYPAL_CLIENT_SECRET}`, // Substitua pelo seu cliente secret do PayPal
  });
  

  // Iniciar Pagamaneto com paypal
  async function iniciarPagamento(req, res)  {
    const createPaymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.PORT_REACT}/sucesso`, // URL de retorno após o pagamento bem-sucedido
        cancel_url: `${process.env.PORT_REACT}/cancelado`, // URL de cancelamento
      },
      
      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'Produto de exemplo',
                price: '10.00', // Preço do produto
                currency: 'BRL', // Moeda (por exemplo, USD para dólares americanos)
                quantity: 1, // Quantidade
              },
            ],
          },
          amount: {
            currency: 'BRL',
            total: '10.00', // Valor total da transação
          },
          description: 'Descrição do pagamento de exemplo',
        },
      ],
    };
  
    paypal.payment.create(createPaymentJson, (error, payment) => {
      if (error) {
        console.error('Erro ao criar pagamento no PayPal:', error);
        res.status(500).json({ error: 'Erro ao criar pagamento no PayPal' });
      } else {
        // Retorne a URL de aprovação do PayPal em vez de redirecionar o cliente
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.status(200).json({ approval_url: payment.links[i].href });
            return; // Saia da função após enviar a resposta JSON
          }
        }
      }
    });
  };
  
  
  // Rota de retorno após o pagamento bem-sucedido
  async function sucessoPagamento(req, res) {
    try {
      const PayerId = req.params.PayerID;
      const PaymentId = req.params.paymentId;
      const user_id = req.user.user_id;
      const Id = uuidv4();
  
      console.log(PaymentId)
      console.log(PayerId)
  
      let errorText = '';
  
      if (!PaymentId || typeof PaymentId !== 'string' || PaymentId.length === 0) {
        errorText = 'paymentId não foi fornecido ou é inválido';
        console.error(errorText);
        return res.status(400).json({ error: errorText });
      }
  
      const executePaymentJson = {
        payer_id: PayerId,
      };
  
      // Execute o pagamento no PayPal
      paypal.payment.execute(PaymentId, executePaymentJson, async (error, payment) => {
        if (error || !payment || !payment.id) {
          console.error(error);
          res.status(500).json({ error: 'Erro ao executar pagamento no PayPal' });
        } else {
          const { id, create_time, state, payer, transactions } = payment;
  
          // Salvar a compra no banco de dados usando o modelo Transacoes
          const savedTransaction = await Transacoes.create({
            id: Id,
            paypal_transaction_id: id,
            create_time,
            state,
            payer: JSON.stringify(payer),
            transactions: JSON.stringify(transactions),
            user_id: user_id,
          });
  
          console.log(savedTransaction);
          res.send('Pagamento concluído com sucesso!');
  
        }
      });
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  };
  
  // Rota de cancelamento de pagamento
  function pagamentoCancelado (req, res) {
    res.send('Pagamento cancelado pelo usuário.');
  };
  
  

  // Aqui eu faço a listar da compra pelo o unico usuario e e verifivo se tem acesso as aulas ou não. 
  async function listarTransacoes(req, res) {
  
    const user_id = req.user.user_id;
  
    try {
      const compra = await Transacoes.findAll({
        where: {
          user_id: user_id,
        },
      });
  
  
      // Envie a imagem como resposta
      return res.status(200).json(compra);
  
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      return res.status(500).send('Ocorreu um erro ao buscar a imagem.');
    }
  };

  module.exports = {
    iniciarPagamento,
    sucessoPagamento,
    pagamentoCancelado,
    listarTransacoes,
  };