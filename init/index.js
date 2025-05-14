//require mongoose
const mongoose = require("mongoose");
//intilization part
const initData = require("./data.js");
//require model
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//for checking the wonderlust addon or not to the shell
main()
 .then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}
//creating fun initdb
const initDB = async() =>{
    //if data already present so clean this data
  await Listing.deleteMany({});
  initData.data = initData.map((obj) =>({...obj, Owner: "678b7338f28050ee74c42529"}));
  //initdata is object and we have to access the key data so we write (data)
  await Listing.insertMany(initData.data);
    console.log("data was intialized");
};
   initDB();