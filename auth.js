const db = require('./db');

function generatePassword(length = 8) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; ++i)
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  return password;
}

async function findUserByEmail(email) {
  const connection = await db.connect();
  return connection.collection("usuarios").findOne({ email });
}

async function findUserByName(nome) {
  const connection = await db.connect();
  return connection.collection("usuarios").findOne({ nome });
}

module.exports = {
  generatePassword,
  findUserByEmail,
  findUserByName
};
