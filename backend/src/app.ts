import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";

dotenv.config();
const app = express();

// app.use(cors()); 
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", authMiddleware, customerRoutes);

export default app;
