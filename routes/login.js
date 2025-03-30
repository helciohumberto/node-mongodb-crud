require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../auth');
const db = require('../db')

/* GET home page. */
router.get('/', (req, res) => {
  res.render("login", { title: "Login", message: "" });
});

router.get('/forgot', (req, res) => {
  res.render("forgot", { title: "Recuperação de Senha", message: "" });
});

router.post('/forgot', async (req, res) => {
  const email = req.body.email;
  if(!email) 
    return res.render("forgot", {title: "Recuperação de Senha", message: "O email é obrigatório"});
  
  const user = await auth.findUserByEmail(email)
  if(!user)
    return res.render("forgot", {title: "Recuperação de Senha", message: "O email não está cadastrado"});
  
  const newPassword = auth.generatePassword();
  user.senha = newPassword;
  
  await db.updateUser(user._id.toString(), user);

  res.render("forgot", { title: "Recuperação de Senha", message: newPassword });
});

router.post('/login', async (req, res) => {

    const nome = req.body.nome;
    const user = await auth.findUserByName(nome);
    
    if (!user) 
      return res.render("login", { title: "Login", message: "Usuário ou senha inválidos" });
    
    const senha = req.body.senha;
    
    if (!bcrypt.compareSync(senha, user.senha)) 
      return res.render("login", { title: "Login", message: "Preencha todos os campos" });
    


    res.redirect("/index");

});

module.exports = router;
