import mongoose, { Error } from "mongoose";

const MONGOURL = process.env.MONGODB_URL;
if (!MONGOURL) {
    throw new Error("Provide MongoURl");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    }
}

const connectDb = async() => {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGOURL).then((conn) => conn.connection);
    }
    try {
        const conn = await cached.promise
        return conn;
    } catch (error) {
        console.log(error);
    }
}
export default connectDb;