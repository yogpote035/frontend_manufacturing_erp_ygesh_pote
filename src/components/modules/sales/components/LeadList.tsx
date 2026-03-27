import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ✅ TYPE DEFINITIONS */
interface Lead {
  id: string;
  company: string;
  contact: string;
  number: string;
  email: string;
}

type TabType = "Weekly" | "Monthly" | "Quarterly" | "Yearly";

/* ✅ DATA */
const INITIAL_LEADS: Lead[] = [
  { id: "L001", company: "Rajesh Electronics", contact: "Rakesh Patil", number: "9869226825", email: "rajesh@electro.com" },
  { id: "L002", company: "Modern Appliances", contact: "Rohit Sharma", number: "9869226825", email: "modern@appl.com" },
  { id: "L003", company: "Home Comfort Pvt Ltd", contact: "Lokesh Pathe", number: "9869226825", email: "homecomfort@mail.com" },
  { id: "L004", company: "City Electronics", contact: "Rakshit Shatty", number: "9869226825", email: "city@electronics.com" },
  { id: "L005", company: "Metro Dealers", contact: "Rhaul Deapande", number: "9869226825", email: "metro@dealers.com" },
];

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("Weekly");

  const navigate = useNavigate();

  /* ✅ FILTER LOGIC */
  const filteredLeads = useMemo<Lead[]>(() => {
    return leads.filter((lead) =>
      Object.values(lead).some((val) =>
        val.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [leads, searchQuery]);

  /* ✅ SELECTION */
  const toggleSelectAll = (): void => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const toggleSelectOne = (id: string): void => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  /* ✅ DELETE */
  const handleDelete = (): void => {
    if (selectedIds.length === 0) return;

    if (window.confirm(`Delete ${selectedIds.length} selected leads?`)) {
      setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      setSelectedIds([]);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-900">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead</h1>
          <p className="text-slate-500 mt-1">
            Manage and track customer leads for electrical products.
          </p>
        </div>

        <button
          onClick={() => navigate("/sales/new-lead")}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800"
        >
          <Plus size={20} />
          New Lead
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b pb-6">
        <div className="flex gap-2">
          {(["Weekly", "Monthly", "Quarterly", "Yearly"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg border text-sm ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-600">
          Week Of 17–23 Mar 2026
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl overflow-hidden">

        {/* Controls */}
        <div className="p-4 flex flex-col lg:flex-row justify-between gap-4">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-10 py-2 bg-gray-100 rounded-lg"
              placeholder="Search..."
            />
          </div>

          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 border rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === filteredLeads.length &&
                    filteredLeads.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Lead ID</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Number</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => toggleSelectOne(lead.id)}
                    />
                  </td>
                  <td>{lead.id}</td>
                  <td>{lead.company}</td>
                  <td>{lead.contact}</td>
                  <td>{lead.number}</td>
                  <td>{lead.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default LeadList;