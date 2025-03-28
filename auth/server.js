import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// Setup Swagger API documentation
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
