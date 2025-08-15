import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:3000',
        'http://localhost:5173',
        process.env.FRONTEND_URL,
        process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : undefined
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

// Export for Vercel serverless function
export default app;

// Only listen on port if not in production (for local development)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}





