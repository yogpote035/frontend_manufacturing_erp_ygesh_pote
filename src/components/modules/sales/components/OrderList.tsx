import React, { useState, useMemo } from "react";
import {
    Plus, ChevronDown, Search, Trash2, ChevronLeft, ChevronRight, ChevronsUpDown, Calendar, Eye, Download, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Status = "Pending" | "Processing" | "Delivered" | "Cancelled" | "All";
type TimeTab = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "All Time";

type Order = {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: Exclude<Status, "All">;
    salesRep: string;
};

const INITIAL_ORDERS: Order[] = [
    { id: "ORD-001", customer: "Rajesh Electronics", date: "2026-03-25", amount: "₹ 25.5L", status: "Processing", salesRep: "Rahul Patil" },
    { id: "ORD-002", customer: "Modern Appliances", date: "2026-03-10", amount: "₹ 5.5L", status: "Pending", salesRep: "Sneha P." },
    { id: "ORD-003", customer: "Kitchen Hub", date: "2026-02-15", amount: "₹ 11.2L", status: "Delivered", salesRep: "Rahul Patil" },
    { id: "ORD-004", customer: "Elite Tech Solutions", date: "2026-03-19", amount: "₹ 18.75L", status: "Pending", salesRep: "Amit S." },
    { id: "ORD-005", customer: "Global Traders", date: "2026-01-05", amount: "₹ 42.0L", status: "Cancelled", salesRep: "Sneha P." },
    { id: "ORD-006", customer: "Oceanic Resorts", date: "2026-03-20", amount: "₹ 14.2L", status: "Processing", salesRep: "Rahul Patil" },
    { id: "ORD-007", customer: "Sunshine Schools", date: "2026-01-15", amount: "₹ 8.1L", status: "Delivered", salesRep: "Amit S." },
];

const OrderList: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TimeTab>("Monthly");
    
    const [statusFilter, setStatusFilter] = useState<Status>("All");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const isDateInRange = (dateStr: string, range: TimeTab) => {
        const date = new Date(dateStr);
        const now = new Date("2026-03-20"); 
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        switch (range) {
            case "Weekly": return diffInDays <= 7 && diffInDays >= 0;
            case "Monthly": return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            case "Quarterly": return Math.floor(now.getMonth() / 3) === Math.floor(date.getMonth() / 3) && date.getFullYear() === now.getFullYear();
            case "Yearly": return date.getFullYear() === now.getFullYear();
            default: return true;
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesSearch = Object.values(o).some((val) => String(val).toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "All" || o.status === statusFilter;
            const matchesTime = isDateInRange(o.date, activeTab);
            return matchesSearch && matchesStatus && matchesTime;
        });
    }, [orders, searchQuery, statusFilter, activeTab]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedOrders.length) setSelectedIds([]);
        else setSelectedIds(paginatedOrders.map(q => q.id));
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = () => {
        if (window.confirm(`Delete ${selectedIds.length} orders?`)) {
            setOrders(prev => prev.filter(q => !selectedIds.includes(q.id)));
            setSelectedIds([]);
            setCurrentPage(1);
        }
    };

    const getStatusColor = (st: string) => {
        switch(st) {
            case "Pending": return "bg-orange-50 text-orange-600 border-orange-200";
            case "Processing": return "bg-blue-50 text-blue-600 border-blue-200";
            case "Delivered": return "bg-green-50 text-green-600 border-green-200";
            case "Cancelled": return "bg-red-50 text-red-600 border-red-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
                        <p className="text-sm text-gray-400 mt-1">Manage and actively track customer orders</p>
                    </div>
                    <button className="flex items-center gap-2 bg-[#005d52] text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-teal-900/20">
                        <Plus size={18} strokeWidth={3} /> Create Order
                    </button>
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
                    <div className="flex items-center gap-2 bg-[#005d52] text-white px-4 py-2 rounded-full text-[11px] font-bold">
                        <Calendar size={13} /> {activeTab} View: Mar 2026
                    </div>
                </div>

                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 flex flex-col xl:flex-row justify-between items-center gap-4 border-b border-gray-50">
                        <div className="relative w-full xl:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search orders..."
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
                                    {statusFilter === "All" ? "Filter by Status" : statusFilter}
                                    <ChevronDown className={`transition-transform duration-300 ${isStatusOpen ? 'rotate-180' : ''}`} size={16}/>
                                </button>
                                {isStatusOpen && (
                                    <div className="absolute top-full mt-1 left-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        {(["All", "Pending", "Processing", "Delivered", "Cancelled"] as Status[]).map(s => (
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

                            {(statusFilter !== "All" || activeTab !== "All Time") && (
                                <button onClick={() => {setStatusFilter("All"); setActiveTab("All Time"); setCurrentPage(1)}} className="p-2.5 text-gray-400 hover:text-[#005d52] transition-colors">
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
                                        <input type="checkbox" className="accent-[#005d52]" checked={selectedIds.length === paginatedOrders.length && paginatedOrders.length > 0} onChange={toggleSelectAll} />
                                    </th>
                                    {["Order ID", "Order Date", "Customer", "Total Amount", "Status", "Sales Rep", "Actions"].map((col) => (
                                        <th key={col} className="p-5 border-l border-gray-100 whitespace-nowrap">
                                            <div className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                                                {col} <ChevronsUpDown size={12} className="opacity-40" />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginatedOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-5 sticky left-0 bg-white z-10"><input type="checkbox" className="accent-[#005d52]" checked={selectedIds.includes(o.id)} onChange={() => toggleSelectOne(o.id)} /></td>
                                        <td className="p-5 text-sm font-bold text-[#005d52]">{o.id}</td>
                                        <td className="p-5 text-sm text-gray-800 whitespace-nowrap">{o.date}</td>
                                        <td className="p-5 text-sm text-gray-800 font-medium">{o.customer}</td>
                                        <td className="p-5 text-sm text-gray-800 font-extrabold">{o.amount}</td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold whitespace-nowrap ${getStatusColor(o.status)}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-700 whitespace-nowrap">{o.salesRep}</td>
                                        <td className="p-5">
                                            <div className="flex gap-2">
                                                <button onClick={() => navigate(`/sales/order-view/${o.id}`)} className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><Eye size={18}/></button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"><Download size={16}/></button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-md text-gray-600 hover:text-red-500 transition-colors" onClick={() => setOrders(prev => prev.filter(x => x.id !== o.id))}><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-20 text-center text-gray-400 italic">No orders match your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-gray-50/20 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-gray-800">{paginatedOrders.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> out of <span className="text-gray-800">{filteredOrders.length}</span> Orders
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

export default OrderList;
