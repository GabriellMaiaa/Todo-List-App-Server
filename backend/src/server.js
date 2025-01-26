import express from "express";
import router from "./routes/routes";
import cors from "cors";
require("dotenv").config();

const app = express();
const port = 3333;
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET, // Usando o segredo armazenado no .env
  { expiresIn: "1h" }
);
const decoded = jwt.verify(token, process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());
app.use("/list", router);

app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
