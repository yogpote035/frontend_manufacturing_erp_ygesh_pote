import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { 
    ChevronRight, 
    Building2, 
    Package, 
    FileText, 
    Plus, 
    ChevronDown,
    ArrowLeft,
    Trash2,
    Save,
    MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Interfaces ---
interface LeadFormData {
    companyName: string;
    contactPerson: string;
    designation: string;
    phoneNumber: string;
    email: string;
    gstNumber: string;
    city: string;
    state: string;
    leadSource: string;
    priority: string;
    expectedDecisionDate: string;
    followUpDate: string;
    initialStatus: string;
    address: string;
    notes: string;
}

interface ProductItem {
    id: number;
    product: string;
    variant: string;
    quantity: number;
    unit: string;
    estValue: number;
    assignedTo: string;
}

const LeadForm: React.FC = () => {
    const navigate = useNavigate();
    
    // --- State ---
    const [formData, setFormData] = useState<LeadFormData>({
        companyName: "",
        contactPerson: "",
        designation: "",
        phoneNumber: "",
        email: "",
        gstNumber: "",
        city: "",
        state: "",
        leadSource: "",
        priority: "",
        expectedDecisionDate: "",
        followUpDate: "",
        initialStatus: "",
        address: "",
        notes: "",
    });

    const [products, setProducts] = useState<ProductItem[]>([
        { id: Date.now(), product: "", variant: "Advance", quantity: 1, unit: "Units", estValue: 0, assignedTo: "" }
    ]);

    const [summary, setSummary] = useState({ totalQty: 0, totalValue: 0 });

    useEffect(() => {
        const qty = products.reduce((acc, curr) => acc + Number(curr.quantity), 0);
        const val = products.reduce((acc, curr) => acc + (Number(curr.quantity) * Number(curr.estValue)), 0);
        setSummary({ totalQty: qty, totalValue: val });
    }, [products]);

    // --- Handlers ---
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (id: number, field: keyof ProductItem, value: string | number) => {
        setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const addProduct = () => {
        setProducts([...products, { id: Date.now(), product: "", variant: "Standard", quantity: 1, unit: "Units", estValue: 0, assignedTo: "" }]);
    };

    const removeProduct = (id: number) => {
        if (products.length > 1) setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#f4f7f6] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                
                {/* Breadcrumbs & Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 mb-1 text-sm">
                            <button onClick={() => navigate(-1)} className="hover:text-[#005d52] flex items-center gap-1">
                                <ArrowLeft size={14} /> Leads
                            </button>
                            <ChevronRight size={14} />
                            <span className="text-gray-800 font-medium">New Lead</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Create New Lead</h1>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                            Save Draft
                        </button>
                        <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-sm text-white bg-[#005d52] shadow-lg shadow-teal-900/20 hover:bg-[#004a41] transition-all">
                            Create Lead
                        </button>
                    </div>
                </div>

                {/* Stepper Progress */}
                <div className="bg-white rounded-3xl p-6 mb-8 border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-between min-w-150 px-8">
                        {[
                            { step: 1, label: "Customer Info", active: true },
                            { step: 2, label: "Product Selection", active: false },
                            { step: 3, label: "Assignment", active: false },
                            { step: 4, label: "Review", active: false }
                        ].map((item, idx) => (
                            <React.Fragment key={item.step}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        item.active ? 'bg-[#005d52] text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {item.step}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${item.active ? 'text-[#005d52]' : 'text-gray-400'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {idx < 3 && <div className="h-0.5 flex-1 bg-gray-100 mx-4" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    <form className="p-8 lg:p-12 space-y-12">
                        
                        {/* Section 1: Customer Info */}
                        <section>
                            <SectionHeader icon={<Building2 size={18}/>} title="Company Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormInput label="Company Name" name="companyName" placeholder="e.g. Rajesh Electronics" value={formData.companyName} onChange={handleInputChange} required />
                                <FormInput label="Contact Person" name="contactPerson" placeholder="Full Name" value={formData.contactPerson} onChange={handleInputChange} required />
                                <FormInput label="Designation" name="designation" placeholder="e.g. Proprietor" value={formData.designation} onChange={handleInputChange} />
                                <FormInput label="Phone Number" name="phoneNumber" placeholder="+91 00000 00000" value={formData.phoneNumber} onChange={handleInputChange} required />
                                <FormInput label="Email Address" name="email" placeholder="email@company.com" type="email" value={formData.email} onChange={handleInputChange} />
                                <FormInput label="GST Number" name="gstNumber" placeholder="27XXXXX0000X0Z0" value={formData.gstNumber} onChange={handleInputChange} />
                                <FormInput label="City" name="city" placeholder="Pune" value={formData.city} onChange={handleInputChange} />
                                <FormInput label="State" name="state" placeholder="Maharashtra" value={formData.state} onChange={handleInputChange} />
                                <FormSelect label="Lead Source" name="leadSource" value={formData.leadSource} onChange={handleInputChange} options={["Website", "Trade Show", "Referral", "Cold Call"]} />
                            </div>
                        </section>

                        {/* Section 2: Products */}
                        <section>
                            <SectionHeader icon={<Package size={18}/>} title="Products of Interest" />
                            <div className="space-y-4">
                                {products.map((item) => (
                                    <div key={item.id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 items-end transition-all hover:bg-gray-50">
                                        <div className="md:col-span-3">
                                            <FormSelect label="Select Product" name="product" value={item.product} onChange={(e) => handleProductChange(item.id, 'product', e.target.value)} options={["Refrigerator", "AC", "Washing Machine", "Microwave"]} />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormInput label="Variant" name="variant" placeholder="Model" value={item.variant} onChange={(e) => handleProductChange(item.id, 'variant', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <FormInput label="Qty" name="quantity" type="number" value={String(item.quantity)} onChange={(e) => handleProductChange(item.id, 'quantity', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormInput label="Est. Unit Value (₹)" name="estValue" type="number" value={String(item.estValue)} onChange={(e) => handleProductChange(item.id, 'estValue', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-1 flex justify-center pb-2">
                                            <button type="button" onClick={() => removeProduct(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <button type="button" onClick={addProduct} className="flex items-center gap-2 text-[#005d52] font-bold text-xs uppercase tracking-widest p-2 hover:opacity-70 transition-opacity">
                                    <Plus size={16} strokeWidth={3} /> Add Another Product
                                </button>
                            </div>

                            {/* Summary Totals Card */}
                            <div className="mt-8 bg-[#005d52] rounded-3xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-teal-900/20">
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest mb-1">Total Quantity</p>
                                        <p className="text-xl font-bold">{summary.totalQty} Units</p>
                                    </div>
                                    <div className="w-px h-10 bg-white/20 hidden md:block" />
                                    <div>
                                        <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest mb-1">Est. Deal Value</p>
                                        <p className="text-xl font-bold">₹ {summary.totalValue.toLocaleString('en-IN')}L</p>
                                    </div>
                                </div>
                                <p className="text-xs opacity-70 italic max-w-xs text-center md:text-right">
                                    Values are approximate based on current market rates. Final pricing will be in the quotation.
                                </p>
                            </div>
                        </section>

                        {/* Section 3: Logistics & Address */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <SectionHeader icon={<FileText size={18}/>} title="Lead Logistics" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <FormSelect label="Priority" name="priority" value={formData.priority} onChange={handleInputChange} options={["Hot", "Warm", "Cold"]} />
                                    <FormSelect label="Initial Status" name="initialStatus" value={formData.initialStatus} onChange={handleInputChange} options={["New Lead", "Contacted", "Qualified"]} />
                                    <FormInput label="Decision Date" name="expectedDecisionDate" type="date" value={formData.expectedDecisionDate} onChange={handleInputChange} />
                                    <FormInput label="Follow-up Date" name="followUpDate" type="date" value={formData.followUpDate} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <SectionHeader icon={<MapPin size={18}/>} title="Site Address" />
                                <textarea 
                                    name="address"
                                    placeholder="Full delivery/installation address..."
                                    rows={4}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-5 text-sm focus:ring-2 focus:ring-[#005d52]/10 outline-none transition-all resize-none"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </section>

                        {/* Section 4: Notes */}
                        <section>
                            <SectionHeader icon={<Save size={18}/>} title="Internal Remarks" />
                            <div className="bg-[#f1f8f7] rounded-3xl p-6 border-l-4 border-[#005d52]">
                                <textarea 
                                    name="notes"
                                    placeholder="Add any specific requirements or background info here..."
                                    className="w-full bg-transparent border-none text-sm text-gray-700 italic focus:ring-0 outline-none resize-none"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </section>

                        {/* Final Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-50">
                            <button type="button" onClick={() => navigate(-1)} className="order-2 sm:order-1 flex-1 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors">
                                Discard Changes
                            </button>
                            <button type="submit" className="order-1 sm:order-2 flex-2 bg-[#005d52] text-white py-4 rounded-full font-bold text-lg shadow-xl shadow-teal-900/20 hover:bg-[#004a41] transition-all flex items-center justify-center gap-3">
                                <Save size={20} /> Save & Finalize Lead
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-[#d1e9e7] text-[#005d52] rounded-xl">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
    </div>
);

const FormInput: React.FC<{ label: string; name: string; placeholder?: string; type?: string; value: string; onChange: (e: any) => void; required?: boolean }> = ({ 
    label, name, placeholder, type = "text", value, onChange, required 
}) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input 
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#005d52]/10 focus:border-[#005d52] outline-none transition-all"
        />
    </div>
);

const FormSelect: React.FC<{ label: string; name: string; value: string; options: string[]; onChange: (e: any) => void }> = ({ 
    label, name, value, options, onChange 
}) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <div className="relative">
            <select 
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#005d52]/10 outline-none appearance-none cursor-pointer transition-all"
            >
                <option value="">Select Option</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={16} />
        </div>
    </div>
);

export default LeadForm;