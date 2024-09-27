import mongoose, { Connection } from "mongoose";
import env from "./env";

/**
 * Database class. Handles MongoDB database connections.
 */
export class DB {
	connection: Connection;

	/**
	 * Connects to a MongoDB server and subsequently opens a MongoDB connection
	 */
	async connect() {
		await mongoose.connect(env.mongo_url);

		this.connection = mongoose.connection;
	}

	/**
	 * Closes all connections in the Mongoose connection pool:
	 */
	async disconnect() {
		await mongoose.disconnect();
	}
}

export default new DB();
