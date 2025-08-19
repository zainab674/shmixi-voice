import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Bot, 
    Search, 
    Download, 
    Eye, 
    Edit, 
    Trash2, 
    Calendar,
    Building,
    Mail,
    Globe,
    RotateCcw
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Lead {
    _id: string;
    name: string;
    company: string;
    email: string;
    message: string;
    source: string;
    user_agent: string;
    timestamp: string;
    notes?: string;
}

export default function Admin() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);

    // Fetch all leads
    const fetchLeads = async () => {
        try {
            setLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${backendUrl}/api/v1/leads`);
            if (!response.ok) throw new Error("Failed to fetch leads");
            
            const data = await response.json();
            setLeads(data.data || []);
            setFilteredLeads(data.data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast({
                title: "Error",
                description: "Failed to fetch leads. Please try again.",
                variant: "destructive" as any,
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter leads based on search
    useEffect(() => {
        let filtered = leads;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.message.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredLeads(filtered);
    }, [leads, searchTerm]);

    // Update lead notes
    const updateLeadNotes = async (leadId: string, notes: string) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${backendUrl}/api/v1/leads/${leadId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notes }),
            });

            if (!response.ok) throw new Error("Failed to update lead");

            toast({
                title: "Success",
                description: "Lead notes updated successfully.",
            });

            // Refresh leads
            fetchLeads();
        } catch (error) {
            console.error("Error updating lead:", error);
            toast({
                title: "Error",
                description: "Failed to update lead notes.",
                variant: "destructive" as any,
            });
        }
    };

    // Delete lead
    const deleteLead = async (leadId: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
            const response = await fetch(`${backendUrl}/api/v1/leads/${leadId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete lead");

            toast({
                title: "Success",
                description: "Lead deleted successfully.",
            });

            // Refresh leads
            fetchLeads();
        } catch (error) {
            console.error("Error deleting lead:", error);
            toast({
                title: "Error",
                description: "Failed to delete lead.",
                variant: "destructive" as any,
            });
        }
    };

    // Export leads to CSV
    const exportToCSV = () => {
        const headers = ["Name", "Company", "Email", "Message", "Source", "Timestamp", "Notes"];
        const csvContent = [
            headers.join(","),
            ...filteredLeads.map(lead => [
                `"${lead.name}"`,
                `"${lead.company}"`,
                `"${lead.email}"`,
                `"${lead.message.replace(/"/g, '""')}"`,
                `"${lead.source}"`,
                new Date(lead.timestamp).toLocaleDateString(),
                `"${lead.notes || ''}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Lead Management</h1>
                    </div>
                    <p className="text-gray-600">Manage and track all your business leads</p>
                </div>

                {/* Search and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search leads..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={fetchLeads} variant="outline" className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Refresh
                            </Button>
                            <Button onClick={exportToCSV} className="gap-2">
                                <Download className="w-4 h-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">All Leads ({filteredLeads.length})</h2>
                    </div>
                    
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                Loading leads...
                            </div>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {searchTerm ? "No leads match your search." : "No leads found."}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Lead Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Source
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredLeads.map((lead) => (
                                        <tr key={lead._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{lead.company}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-900">{lead.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-900 line-clamp-2">{lead.message}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500 truncate max-w-32">
                                                        {lead.source}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(lead.timestamp).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingLead(lead);
                                                            setShowLeadModal(true);
                                                        }}
                                                        className="gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </Button>
                                                   
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => deleteLead(lead._id)}
                                                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Lead Detail Modal */}
            {showLeadModal && editingLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowLeadModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Name</Label>
                                        <p className="text-gray-900 mt-1">{editingLead.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Company</Label>
                                        <p className="text-gray-900 mt-1">{editingLead.company}</p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                    <p className="text-gray-900 mt-1">{editingLead.email}</p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Message</Label>
                                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{editingLead.message}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Source</Label>
                                        <p className="text-gray-900 mt-1">{editingLead.source}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">Date</Label>
                                        <p className="text-gray-900 mt-1">
                                            {new Date(editingLead.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Notes</Label>
                                    <textarea
                                        value={editingLead.notes || ""}
                                        onChange={(e) => setEditingLead({...editingLead, notes: e.target.value})}
                                        className="w-full mt-1 p-3 border border-gray-300 rounded-lg resize-none"
                                        rows={3}
                                        placeholder="Add notes about this lead..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={() => {
                                            updateLeadNotes(editingLead._id, editingLead.notes || "");
                                            setShowLeadModal(false);
                                        }}
                                        className="flex-1"
                                    >
                                        Save Notes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowLeadModal(false)}
                                        className="flex-1"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
