const mongoose = require("mongoose");
const initData = require("./data.js");
const Product = require("../models/products.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/gym";

main().then(() => {
    console.log("MongoDB connected successfully!");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
    await initDB(); 
}

const initDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany(initData.data);
    console.log("Data was initialized");
}
