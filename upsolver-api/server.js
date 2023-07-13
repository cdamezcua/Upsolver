import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import { FRONT_END_BASE_URL } from "./constants/urls.js";
import { PORT } from "./constants/config.js";

const app = express();

app.use(
  cors({
    origin: FRONT_END_BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
