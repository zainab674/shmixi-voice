import express from "express";
import {
    createLead,
    getAllLeads,
    getLeadById,
    updateLeadStatus,
    deleteLead
} from "../controllers/leadController.js";

const router = express.Router();

// Create a new lead
router.post("/", createLead);

// Get all leads
router.get("/", getAllLeads);

// Get lead by ID
router.get("/:id", getLeadById);

// Update lead status
router.patch("/:id", updateLeadStatus);

// Delete lead
router.delete("/:id", deleteLead);

export default router;
