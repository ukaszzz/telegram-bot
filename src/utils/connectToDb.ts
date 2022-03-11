import * as mongoose from "mongoose";
import config from "../config/default";

async function connectToDb() {
    try {
        await mongoose.connect(config.dbConnectUrl);
        console.log('db connected');
    } catch (e) {
        process.exit(1)
    }
};

export default connectToDb;