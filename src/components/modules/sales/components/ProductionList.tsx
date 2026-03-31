import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Trash2, ChevronLeft, ChevronRight, ChevronsUpDown, Calendar, Edit3, X, Filter } from "lucide-react";
import {
    formatDateForInput,
    getTimeTabLabel,
    isDateInRange,
    isDateWithinCustomRange,
    type DateRange,
    type TimeTab,
} from "../utils/dateFilters";

type ProdStatus = "In Progress" | "On Hold" | "Completed" | "Delayed" | "All";
type Stage = "Raw Materials" | "Cutting" | "Assembly" | "Quality Check" | "Packaging";

type ProductionJob = {
    id: string;
    orderRef: string;
    product: string;
    quantity: number;
    stage: Stage;
    status: Exclude<ProdStatus, "All">;
    updatedAt: string;
};

const INITIAL_JOBS: ProductionJob[] = [
    { id: "PROD-1029", orderRef: "ORD-001", product: "Standard Control Panel", quantity: 15, stage: "Assembly", status: "In Progress", updatedAt: "2026-03-25" },
    { id: "PROD-1030", orderRef: "ORD-002", product: "HVAC Unit V3", quantity: 5, stage: "Cutting", status: "Delayed", updatedAt: "2026-03-24" },
    { id: "PROD-1031", orderRef: "ORD-003", product: "Motor Assemblies", quantity: 100, stage: "Packaging", status: "Completed", updatedAt: "2026-03-23" },
    { id: "PROD-1032", orderRef: "ORD-006", product: "Copper Wiring Bundle", quantity: 50, stage: "Raw Materials", status: "On Hold", updatedAt: "2026-03-22" },
    { id: "PROD-1033", orderRef: "ORD-010", product: "Industrial Generator", quantity: 2, stage: "Quality Check", status: "In Progress", updatedAt: "2026-03-25" },
];

const ProductionList: React.FC = () => {
    const [jobs, setJobs] = useState<ProductionJob[]>(INITIAL_JOBS);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TimeTab>("Weekly");
    const [customDateRange, setCustomDateRange] = useState<DateRange>({
        from: "",
        to: formatDateForInput(new Date()),
    });
    
    const [statusFilter, setStatusFilter] = useState<ProdStatus>("All");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredJobs = useMemo(() => {
        return jobs.filter((j) => {
            const matchesSearch = Object.values(j).some((val) => String(val).toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "All" || j.status === statusFilter;
            const matchesTime = isDateInRange(j.updatedAt, activeTab);
            const matchesCustomRange = isDateWithinCustomRange(j.updatedAt, customDateRange);
            return matchesSearch && matchesStatus && matchesTime && matchesCustomRange;
        });
    }, [jobs, searchQuery, statusFilter, activeTab, customDateRange]);

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedJobs.length) setSelectedIds([]);
        else setSelectedIds(paginatedJobs.map(j => j.id));
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} production jobs?`)) {
            setJobs(prev => prev.filter(q => !selectedIds.includes(q.id)));
            setSelectedIds([]);
            setCurrentPage(1);
        }
    };

    const getStatusColor = (st: string) => {
        switch(st) {
            case "In Progress": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Completed": return "bg-green-50 text-green-600 border-green-200";
            case "Delayed": return "bg-red-50 text-red-600 border-red-200";
            case "On Hold": return "bg-orange-50 text-orange-600 border-orange-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    }

    const getStageColor = (st: string) => {
        switch(st) {
            case "Raw Materials": return "text-purple-600 bg-purple-50 font-medium";
            case "Cutting": return "text-indigo-600 bg-indigo-50 font-medium";
            case "Assembly": return "text-teal-600 bg-teal-50 font-medium";
            case "Quality Check": return "text-blue-600 bg-blue-50 font-medium";
            case "Packaging": return "text-green-600 bg-green-50 font-medium";
            default: return "text-gray-600 bg-gray-50 font-medium";
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Production Tracking</h1>
                        <p className="text-sm text-gray-400 mt-1">Monitor live manufacturing stages</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold border border-gray-200 text-gray-600">
                        <Calendar size={14} /> {getTimeTabLabel(activeTab)}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-white/60 rounded-2xl border border-white shadow-sm">
                        {(["Weekly", "Monthly", "Quarterly", "Yearly", "All Time"] as TimeTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${
                                    activeTab === tab ? "bg-[#005d52] text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="date"
                            value={customDateRange.from}
                            onChange={(e) => { setCustomDateRange((prev) => ({ ...prev, from: e.target.value })); setCurrentPage(1); }}
                            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#005d52]/20"
                        />
                        <input
                            type="date"
                            value={customDateRange.to}
                            onChange={(e) => { setCustomDateRange((prev) => ({ ...prev, to: e.target.value })); setCurrentPage(1); }}
                            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#005d52]/20"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-50">
                        <div className="relative w-full xl:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Order Ref or Product..."
                                value={searchQuery}
                                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                                className="w-full pl-11 pr-4 py-2.5 bg-[#f4f7f6] border-none rounded-full focus:ring-2 focus:ring-[#005d52]/20 text-sm outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-center">
                            <div className="relative">
                                <button 
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    className={`flex items-center gap-3 px-6 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                                        statusFilter !== "All" ? "bg-[#d1e9e7] border-[#005d52] text-[#005d52]" : "bg-white border-gray-200 text-gray-700"
                                    }`}
                                >
                                    <Filter size={16} /> 
                                    {statusFilter === "All" ? "Filter by Status" : statusFilter}
                                    <ChevronDown className={`transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isStatusOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "In Progress", "On Hold", "Completed", "Delayed"] as ProdStatus[]).map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => {setStatusFilter(s); setIsStatusOpen(false); setCurrentPage(1)}}
                                                className={`w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition-colors ${statusFilter === s ? "text-[#005d52] font-bold" : "text-gray-600"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {(statusFilter !== "All" || activeTab !== "All Time" || customDateRange.from !== "" || customDateRange.to !== formatDateForInput(new Date())) && (
                                <button onClick={() => {
                                    setStatusFilter("All");
                                    setActiveTab("All Time");
                                    setCustomDateRange({ from: "", to: formatDateForInput(new Date()) });
                                    setCurrentPage(1);
                                }} className="p-2.5 text-gray-400 hover:text-[#005d52] transition-colors">
                                    <X size={20} />
                                </button>
                            )}
                            <button onClick={handleDelete} disabled={selectedIds.length === 0} className="p-2.5 bg-red-50 text-red-500 rounded-lg disabled:opacity-30 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-200">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-800 uppercase tracking-widest">
                                    <th className="p-5 w-12 sticky left-0 bg-gray-50/50 z-10">
                                        <input type="checkbox" className="accent-[#005d52]" checked={selectedIds.length === paginatedJobs.length && paginatedJobs.length > 0} onChange={toggleSelectAll} />
                                    </th>
                                    {["Job ID", "Order Ref", "Product", "Qty", "Stage", "Status", "Last Updated", "Actions"].map((col) => (
                                        <th key={col} className="p-5 border-l border-gray-100 whitespace-nowrap">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                                                {col} <ChevronsUpDown size={12} className="opacity-40" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedJobs.map((j) => (
                                    <tr key={j.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-5 sticky left-0 bg-white z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.includes(j.id)} onChange={() => toggleSelectOne(j.id)} /></td>
                                        <td className="p-5 text-sm font-bold text-[#005d52]">{j.id}</td>
                                        <td className="p-5 text-sm font-bold text-gray-600 underline cursor-pointer hover:text-[#005d52]">{j.orderRef}</td>
                                        <td className="p-5 text-sm text-gray-800 font-medium">{j.product}</td>
                                        <td className="p-5 text-sm font-bold text-gray-600">{j.quantity}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg text-[11px] whitespace-nowrap ${getStageColor(j.stage)}`}>
                                                {j.stage}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold whitespace-nowrap ${getStatusColor(j.status)}`}>
                                                {j.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-500 whitespace-nowrap">{j.updatedAt}</td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><Edit3 size={18}/></button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-600 hover:text-red-500 transition-colors" onClick={() => setJobs(prev => prev.filter(x => x.id !== j.id))}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedJobs.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="p-20 text-center text-gray-400 italic">No production jobs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-gray-50/20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-800">{paginatedJobs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredJobs.length)}</span> out of <span className="text-gray-800">{filteredJobs.length}</span> Jobs
                        </p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))} disabled={currentPage === 1} className="text-xs font-bold text-gray-400 hover:text-[#005d52] disabled:opacity-20 flex items-center gap-1 uppercase"><ChevronLeft size={16}/> Prev</button>
                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-8 h-8 rounded-lg text-xs font-bold ${currentPage === i+1 ? "bg-[#005d52] text-white shadow-md" : "text-gray-400 hover:bg-gray-100"}`}>{i+1}</button>
                                ))}
                            </div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev+1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="text-xs font-bold text-gray-400 hover:text-[#005d52] disabled:opacity-20 flex items-center gap-1 uppercase">Next <ChevronRight size={16}/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionList;
