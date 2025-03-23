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
  res.render("customer", {title: "Cadastro de Cliente"});
});

module.exports = router;
