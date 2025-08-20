import { ObjectId } from 'mongodb';
import { getCollection } from './databaseService.js';

const COLLECTION_NAME = 'leads';

// Create a new lead
export const createLead = async (leadData) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        
        // Add timestamp and default status
        const leadWithDefaults = {
            ...leadData,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'new'
        };
        
        const result = await collection.insertOne(leadWithDefaults);
        console.log('✅ Lead saved to MongoDB:', result.insertedId);
        
        return {
            success: true,
            id: result.insertedId,
            message: 'Lead created successfully'
        };
    } catch (error) {
        console.error('❌ Error saving lead to MongoDB:', error);
        throw error;
    }
};

// Get all leads
export const getAllLeads = async () => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        const leads = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return leads;
    } catch (error) {
        console.error('❌ Error fetching leads from MongoDB:', error);
        throw error;
    }
};

// Get lead by ID
export const getLeadById = async (id) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid lead ID format');
        }
        
        const lead = await collection.findOne({ _id: new ObjectId(id) });
        return lead;
    } catch (error) {
        console.error('❌ Error fetching lead by ID from MongoDB:', error);
        throw error;
    }
};

// Update lead status
export const updateLeadStatus = async (id, status, notes = null) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid lead ID format');
        }
        
        const updateData = { 
            status, 
            updatedAt: new Date() 
        };
        
        if (notes !== null) {
            updateData.notes = notes;
        }
        
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        return result.modifiedCount > 0;
    } catch (error) {
        console.error('❌ Error updating lead status in MongoDB:', error);
        throw error;
    }
};

// Delete lead
export const deleteLead = async (id) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid lead ID format');
        }
        
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('❌ Error deleting lead from MongoDB:', error);
        throw error;
    }
};

// Get leads by status
export const getLeadsByStatus = async (status) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        const leads = await collection.find({ status }).sort({ createdAt: -1 }).toArray();
        return leads;
    } catch (error) {
        console.error('❌ Error fetching leads by status from MongoDB:', error);
        throw error;
    }
};

// Search leads
export const searchLeads = async (searchTerm) => {
    try {
        const collection = await getCollection(COLLECTION_NAME);
        
        const searchQuery = {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { company: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
                { message: { $regex: searchTerm, $options: 'i' } }
            ]
        };
        
        const leads = await collection.find(searchQuery).sort({ createdAt: -1 }).toArray();
        return leads;
    } catch (error) {
        console.error('❌ Error searching leads in MongoDB:', error);
        throw error;
    }
};
