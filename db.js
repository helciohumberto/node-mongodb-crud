require('dotenv').config();

const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs')

const PAGE_SIZE = 5;
let db = null;

async function connect() {
    if (db) return db; 

    const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        db = client.db("luiztools"); 
        console.log("Conectado ao MongoDB!");
        return db;
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err);
        db = null;
        throw err;
    }
}


async function countCustomers() {
    const connection = await connect();
    return connection.collection("clientes").countDocuments();
}

async function findCustomers(page = 1) {
    const connection = await connect();
    const totalSkip = (page - 1) * PAGE_SIZE;
    return connection.collection("clientes")
                     .find({})
                     .skip(totalSkip)
                     .limit(PAGE_SIZE)
                     .toArray();
}

async function findCustomer(id) {
    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("clientes").findOne({ _id: objectId });
}

async function insertCustomer(customer) {
    const connection = await connect();
    return connection.collection("clientes").insertOne(customer);
}

async function updateCustomer(id, customer) {
    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("clientes").updateOne({ _id: objectId }, { $set: customer });
}

async function deleteCustomer(id) {
    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("clientes").deleteOne({ _id: objectId });
}

// usuários
async function countUsers() {
    const connection = await connect();
    return connection.collection("usuarios").countDocuments();
}

async function findUsers(page = 1) {
    const connection = await connect();
    const totalSkip = (page - 1) * PAGE_SIZE;
    return connection.collection("usuarios")
                     .find({})
                     .skip(totalSkip)
                     .limit(PAGE_SIZE)
                     .toArray();
}

async function findUser(id) {
    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("usuarios").findOne({ _id: objectId });
}

async function insertUser(user) {
    user.senha = bcrypt.hashSync(user.senha, 12);

    const connection = await connect();
    return connection.collection("usuarios").insertOne(user);
}

async function updateUser(id, user) {
    if(user.senha)
       user.senha = bcrypt.hashSync(user.senha, 12);

    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("usuarios").updateOne({ _id: objectId }, { $set: user });
}

async function deleteUser(id) {
    const connection = await connect();
    const objectId = new ObjectId(id);
    return connection.collection("usuarios").deleteOne({ _id: objectId });
}

module.exports = { 
    PAGE_SIZE,
    findCustomers,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    findCustomer,
    countCustomers,
    countUsers,
    findUsers,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
    connect
};
