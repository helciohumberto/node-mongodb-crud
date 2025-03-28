require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

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

connect();

function findCustomers() {
    return global.connection
        .collection("clientes")
        .find({})
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

module.exports = { 
    findCustomers,
    insertCustomer,
    updateCustomer,
    deleteCustomer,
    findCustomer
};
