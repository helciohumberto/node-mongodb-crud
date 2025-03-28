const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', (req, res, next) => {
  db.findCustomers()
    .then(customers => {
      console.log(customers)
      res.render("index", {title: "Express", customers})
    })
    .catch(error => console.log(error));
});

router.get('/new', (req, res) => {
  res.render("customer", {title: "Cadastro de Cliente", customer: {}});
});

router.get('/edit/:customerId', (req, res) => {
  const id = req.params.customerId;
  db.findCustomer(id)
    .then(customer => res.render("customer", {title: "Edição de Cadastro", customer}))
    .catch(error => console.log(error));
  
})

router.post('/new', (req, res) => {

  if(!req.body.nome)
    return res.redirect("/new?error=O campo nome é obrigatório");
  if (!req.body.idade || isNaN(req.body.idade)) {
    return res.redirect("/new?error=O campo idade deve ser numérico");
  }
  

  const id = req.body.id;
  const nome = req.body.nome;
  const idade = parseInt(req.body.idade);
  const cidade = req.body.cidade;
  const uf = req.body.uf.length > 2 ? '' : req.body.uf;

  const customer = { nome, idade, cidade, id };
  const promise = id ? db.updateCustomer(id, customer)
                     : db.insertCustomer(customer);

  promise
    .then(result => {
      res.redirect("/");
    })
    .catch(error => {
      return console.log(error);
    });
});

module.exports = router;

