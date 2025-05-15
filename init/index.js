const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/wonderlust"

main()
.then(()=>{
    console.log("connected to db");
}).catch((err) =>{
    console.log("this is the error");
});
async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async() =>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj , owner:'681debf08dd0f938b415fccb'}));
    await listing.insertMany(initdata.data);
    console.log("data was initialized .");
}

initDB();