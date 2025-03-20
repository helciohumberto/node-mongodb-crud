require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");

async function connect() {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    global.connection = client.db();
    console.log("Connected to MongoDB!");
}

connect();

function findCustomers() {
    return global.connection
        .collection("clientes")
        .find({})
        .toArray();
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
    deleteCustomer
};
