import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URI;

mongoose.connect(connectionURL!);
