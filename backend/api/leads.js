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

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Method not allowed. Use POST.' 
        });
    }

    try {
        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
        }
        
        // Get or create Lead model
        const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

        const { name, company, email, message, totalRevenue, teamMembers, phone, website, source, user_agent, timestamp } = req.body;

        // Validate required fields
        if (!name || !company || !email || !message || !source || !user_agent) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
        }

        // Create new lead
        const newLead = new Lead({
            name,
            company,
            email,
            message,
            totalRevenue,
            teamMembers,
            phone,
            website,
            source,
            user_agent,
            timestamp: timestamp || new Date()
        });

        // Save to database
        const savedLead = await newLead.save();

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            data: {
                id: savedLead._id,
                name: savedLead.name,
                company: savedLead.company,
                email: savedLead.email,
                status: savedLead.status,
                timestamp: savedLead.timestamp
            }
        });

    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
