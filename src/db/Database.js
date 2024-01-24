import mongoose from "mongoose";
import { DB_Name } from "../constant.js";
const Database = async () => {
	try {
		await mongoose.connect(`${process.env.DATABASE_URI}/${DB_Name}`);
		console.log("Database Connected Successfully throught envirement variable");
	} catch (error) {
		console.log("the error in the database connectivity " + error);
	}
};

export { Database };
