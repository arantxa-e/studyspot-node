import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URI;
const dbName = "studyspot";

mongoose.connect(`${connectionURL}/${dbName}`);
