import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "../routes/index.js";
import { healthCheck, getConnectionStatus } from "../services/databaseService.js";

const app = express();

// CORS configuration - must come before other middleware
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:5173',
        'https://shmixi-voice.vercel.app', // Your frontend domain
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.get("/", (req, res) => {
    console.log("✅ Root route hit");
    res.send("welcome to backend");
});

// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        const dbHealth = await healthCheck();
        const connectionStatus = getConnectionStatus();
        
        res.json({
            success: true,
            timestamp: new Date().toISOString(),
            database: dbHealth,
            connection: connectionStatus,
            message: "Backend is running"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            timestamp: new Date().toISOString(),
            error: error.message,
            message: "Backend health check failed"
        });
    }
});

export default app;
