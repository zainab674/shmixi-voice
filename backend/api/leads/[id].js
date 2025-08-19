import mongoose from "mongoose";

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://zainabsarwar58:zainab984@cluster0.zjkfo.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0';

// Lead schema
const leadSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    totalRevenue: { type: String, trim: true },
    teamMembers: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    source: { type: String, required: true },
    user_agent: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'converted', 'lost'], default: 'new' },
    notes: { type: String, trim: true }
}, { timestamps: true });

// Connection management
let cachedConnection = null;

async function connectToDatabase() {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
            socketTimeoutMS: 45000, // 45 second timeout
            bufferCommands: false, // Disable mongoose buffering
            bufferMaxEntries: 0, // Disable mongoose buffering
        });

        cachedConnection = connection;
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { id } = req.query;
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Lead ID is required"
        });
    }

    if (req.method === 'PATCH') {
        try {
            // Connect to MongoDB with proper connection management
            await connectToDatabase();

            // Get or create Lead model
            const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

            const { notes } = req.body;

            // Update lead with timeout
            const updatedLead = await Promise.race([
                Lead.findByIdAndUpdate(id, { notes }, { new: true }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Database operation timeout')), 8000)
                )
            ]);

            if (!updatedLead) {
                return res.status(404).json({
                    success: false,
                    message: "Lead not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Lead updated successfully",
                data: updatedLead
            });

        } catch (error) {
            console.error("Error updating lead:", error);
            
            // Handle specific MongoDB errors
            if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
                return res.status(503).json({
                    success: false,
                    message: "Database temporarily unavailable. Please try again.",
                    error: "Database connection issue"
                });
            }

            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
        return;
    }

    if (req.method === 'DELETE') {
        try {
            // Connect to MongoDB with proper connection management
            await connectToDatabase();

            // Get or create Lead model
            const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

            // Delete lead with timeout
            const deletedLead = await Promise.race([
                Lead.findByIdAndDelete(id),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Database operation timeout')), 8000)
                )
            ]);

            if (!deletedLead) {
                return res.status(404).json({
                    success: false,
                    message: "Lead not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Lead deleted successfully"
            });

        } catch (error) {
            console.error("Error deleting lead:", error);
            
            // Handle specific MongoDB errors
            if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
                return res.status(503).json({
                    success: false,
                    message: "Database temporarily unavailable. Please try again.",
                    error: "Database connection issue"
                });
            }

            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
        return;
    }

    return res.status(405).json({
        success: false,
        message: 'Method not allowed. Use PATCH or DELETE.'
    });
}
