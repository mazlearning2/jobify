import mongoose from "mongoose";

const databaseConnection = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/mern_jobify",
      { useNewUrlParser: true }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default databaseConnection;
