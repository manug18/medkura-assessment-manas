import express from "express";
import cors from "cors";
import doctorRoutes from "./routes/doctors.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", doctorRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});