import Lead from "../models/Lead.js";

// Create a new lead
export const createLead = async (req, res) => {
    try {
        const { name, company, email, message, source, user_agent, timestamp } = req.body;

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
};

// Get all leads (for admin purposes)
export const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find({})
            .sort({ createdAt: -1 })
            .select('-__v');

        res.status(200).json({
            success: true,
            count: leads.length,
            data: leads
        });

    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get lead by ID
export const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findById(id).select('-__v');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            data: lead
        });

    } catch (error) {
        console.error("Error fetching lead:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update lead status
export const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const lead = await Lead.findByIdAndUpdate(
            id,
            { status, notes },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: lead
        });

    } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete lead
export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
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
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
