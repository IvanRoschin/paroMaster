import mongoose from "mongoose";

const connect = async () => {
  try {
    if (process.env.DB_HOST) await mongoose.connect(process.env.DB_HOST);
    console.log("Mongo connection successful");
  } catch (error) {
    throw new Error("Error of connecting to MongoDB");
  }
};

export default connect;
