require('dotenv').config();

const { MongoClient, ObjectId } = require("mongodb");
const PAGE_SIZE = 5;

async function connect() {
    if(global.connection) return global.connection;

    const client = new MongoClient(process.env.MONGO_URI);

    try{
        await client.connect();
        global.connection = client.db();
        console.log("Connected to MongoDB!");
    } catch(err){
        console.log(err);
        global.connection = null;
    }
}


async function countCustomers() {
    const connection = await connect();
    return connection
           .collection("clientes")
           .countDocuments();
}

function findCustomers(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    return global.connection
        .collection("clientes")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray();
}

function findCustomer(id){
    const objectId = new ObjectId(id);
    return global.connection
                 .collection("clientes")
                 .findOne({_id: objectId});
}

function insertCustomer(customer){
    return global.connection
                 .collection("clientes")
                 .insertOne(customer);
}

function updateCustomer(id, customer){
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
                 .collection("clientes")
                 .updateOne({ _id: objectId }, { $set: customer });
}

function deleteCustomer(id){
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
                 .collection("clientes")
                 .deleteOne({ _id: objectId });
}



//usuarios

async function countUsers() {
    const connection = await connect();
    return connection
           .collection("usuarios")
           .countDocuments();
}

function findUsers(page = 1) {
    const totalSkip = (page - 1) * PAGE_SIZE;
    return global.connection
        .collection("usuarios")
        .find({})
        .skip(totalSkip)
        .limit(PAGE_SIZE)
        .toArray();
}

function findUser(id){
    const objectId = new ObjectId(id);
    return global.connection
                 .collection("usuarios")
                 .findOne({_id: objectId});
}

function insertUser(user){
    return global.connection
                 .collection("usuarios")
                 .insertOne(user);
}

function updateUser(id, user){
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
                 .collection("usuarios")
                 .updateOne({ _id: objectId }, { $set: user });
}

function deleteUser(id){
    const objectId = ObjectId.createFromHexString(id);
    return global.connection
                 .collection("usuarios")
                 .deleteOne({ _id: objectId });
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
