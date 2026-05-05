import { connect } from "mongoose";

try {
  const mongodb_url = process.env.MONGODB_URL!;
  await connect(mongodb_url);
  console.log("Connection to MongoDB server established");
} catch (error) {
  console.log(error);
}