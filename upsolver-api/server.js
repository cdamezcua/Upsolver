import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
