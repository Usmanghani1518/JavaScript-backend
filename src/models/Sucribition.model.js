import mongoose from "mongoose";

const suscribitionSchema = new mongoose.Schema({
suscriber:{
    type:mongoose.Schema.Types.ObjectId, // one who is suscribing
    ref:"User"
},
channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}
},{timestamps:true})

export const Sucribition = mongoose.model("Sucribition",suscribitionSchema)