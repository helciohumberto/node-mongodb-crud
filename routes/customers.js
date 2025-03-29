const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */


router.get('/new', (req, res) => {
  res.render("newCustomer", {title: "Cadastro de Cliente", customer: {}});
});

router.get('/edit/:customerId', (req, res) => {
  const id = req.params.customerId;
  db.findCustomer(id)
    .then(customer => res.render("newCustomer", {title: "Edição de Cadastro", customer}))
    .catch(error => {
      console.log(error);
      res.render("error", {message: "Não foi possível retornar os dados do cliente", error})
    });
  
})

router.get('/delete/:customerId', (req, res) => {
  const id = req.params.customerId;
  db.deleteCustomer(id)
    .then(result => res.redirect('/customers'))
    .catch(error => {
      console.log(error);
      res.render("error", {message: "Não foi possível excluir o cliente", error})
    });
});

router.post('/new', (req, res) => {

  if(!req.body.nome)
    return res.redirect("/customers/new?error=O campo nome é obrigatório");
  if (!req.body.cpf && !/[0-9\.\-]+/.test(req.body.cpf)) {
    return res.redirect("/customers/new?error=O campo CPF é numérico");
  }
  

  const id = req.body.id;
  const nome = req.body.nome;
  const idade = req.body.idade;
  const cidade = req.body.cidade;
  const cpf = req.body.cpf
  const uf = req.body.uf.length > 2 ? '' : req.body.uf;

  const customer = { nome, idade, cidade, id, uf, cpf };
  const promise = id ? db.updateCustomer(id, customer)
                     : db.insertCustomer(customer);

  promise
    .then(result => {
      res.redirect("/customers");
    })
    .catch(error => {
      return console.log(error);
      res.render("error", {message: "Não foi possível salvar o cliente", error})
    });
});

router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);

  try {
    const qty = await db.countCustomers();
    const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
    const customers = await db.findCustomers(page)
    res.render("customers", {title: "Clientes", customers, qty, pagesQty, page});
  } 
  catch(error){
      console.log(error);
      res.render("error", {message: "Não foi possível listar os clientes", error});
  };
});

module.exports = router;

