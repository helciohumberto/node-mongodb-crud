const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render("index", {title: "Login"})
});

module.exports = router;

