import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const port = process.env.PORT || 3001;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
