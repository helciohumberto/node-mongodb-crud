const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */


router.get('/new', (req, res) => {
  res.render("newUser", {title: "Cadastro de Usuário", user: {}});
});

router.get('/edit/:userId', (req, res) => {
  const id = req.params.userId;
  db.findUser(id)
    .then(user => res.render("newUser", {title: "Edição de Usuário", user}))
    .catch(error => {
      console.log(error);
      res.render("error", {message: "Não foi possível retornar os dados do cliente", error})
    });
  
})

router.get('/delete/:userId', (req, res) => {
  const id = req.params.userId;
  db.deleteUser(id)
    .then(result => res.redirect('/users'))
    .catch(error => {
      console.log(error);
      res.render("error", {message: "Não foi possível excluir o usuário", error})
    });
});

router.post('/new', (req, res) => {
  const id = req.body.id;

  if(!req.body.nome)
    return res.redirect("/users/new?error=O campo nome é obrigatório");
  if (!id && !req.body.senha) {
    return res.redirect("/users/new?error=O campo senha é obrigatório");
  }
  
  const nome = req.body.nome;
  const email = req.body.email;
  const perfil = req.body.perfil;
  const user = { nome, email, perfil };

  if(req.body.senha)
    user.senha = req.body.senha;
  

  const promise = id ? db.updateUser(id, user)
                     : db.insertUser(user);

  promise
    .then(result => {
      res.redirect("/users");
    })
    .catch(error => {
      return console.log(error);
      res.render("error", {message: "Não foi possível salvar o usuário", error})
    });
});

router.get('/:page?', async (req, res, next) => {
  const page = parseInt(req.params.page);

  try {
    const qty = await db.countUsers();
    const pagesQty = Math.ceil(qty / db.PAGE_SIZE);
    const users = await db.findUsers(page)
    res.render("users", {title: "Usuários", users, qty, pagesQty, page});
  } 
  catch(error){
      console.log(error);
      res.render("error", {message: "Não foi possível listar os clientes", error});
  };
});

module.exports = router;

