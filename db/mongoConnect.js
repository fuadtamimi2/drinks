// getting-started.js
const mongoose = require('mongoose');
require("dotenv").config();

console.log(process.env.MONGO_DB)
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  // await mongoose.connect('mongodb://127.0.0.1:27017/arial_nov25');
  console.log("mongo connect arial_nov25 atlas")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}