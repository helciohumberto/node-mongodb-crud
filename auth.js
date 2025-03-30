const {connect} = require('./db');

async function findUserByName(nome){
    const connection = await connect();
    return connection
           .collection("usuarios")
           .findOne({nome});
}

async function findUserByEmail(email){
    const connection = await connect();
    return connection
           .collection("usuarios")
           .findOne({email});
}

function generatePassword(){
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let senha = "";

    for(let i=0; i < 10; i++)
        senha += chars.charAt(Math.random() * 61);
    return senha
    
}

module.exports = {
    findUserByName,
    findUserByEmail,
    generatePassword
}