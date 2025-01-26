import express from "express";
import router from "./routes/routes";

const app = express();
const port = 3333;

app.use(cors());
app.use(express.json());
app.use("/list", router);

app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
