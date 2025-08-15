import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "../routes/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use("/api/v1", router);

app.get("/", (req, res) => {
    console.log("✅ Root route hit");
    res.send("welcome to backend");
});

export default app;
