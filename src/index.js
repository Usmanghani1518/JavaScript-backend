import { app } from "./app.js";
import { Database } from "./db/Database.js";
import dotenv from "dotenv";

dotenv.config({
    path:"./src/.env"
})



Database()
.then(()=>{
    app.on("Error",(error)=>{
console.log("the error is " + error);
    })
    app.get('/',(req,res)=>{
        res.send('this is the express app ')
    })
    app.listen( process.env.PORT || 8000 ,()=>{
        console.log('the server is listening on the port ' + process.env.PORT);
    })
})
.catch((error)=>{
    console.log("Mongo Db connectionn failed " + error);
})