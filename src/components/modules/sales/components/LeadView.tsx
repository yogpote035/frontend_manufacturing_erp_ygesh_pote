import React from 'react';
import { ChevronRight } from 'lucide-react';

// --- Types ---
interface Product {
  name: string;
  variant: string;
  qty: string;
  value: string;
}

const LeadView: React.FC = () => {
  const products: Product[] = [
    { name: 'Refrigerator', variant: '4-door 500L', qty: '25 units', value: '₹ 11.3L' },
    { name: 'AC', variant: '1.5 Ton 5-Star', qty: '10 units', value: '₹ 3.5L' },
  ];

  const pipelineStages = [
    { name: 'New Lead', completed: true },
    { name: 'Contacted', completed: true },
    { name: 'Converted', completed: false },
    { name: 'Quotation', completed: false },
    { name: 'Won', completed: false },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-[#1a1a1a]">
      {/* Header & Breadcrumbs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-lg mb-1">
          <span className="text-2xl">Lead</span>
          <ChevronRight size={20} className="mt-1" />
          <span className="font-bold text-black text-3xl">View Lead</span>
        </div>
        <p className="text-sm text-gray-500">
          Manage and track customer leads for electrical products, from inquiry to conversion.
        </p>
      </div>

      {/* Main Content Card */}
      <div className="max-w-6xl mx-auto border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-10 space-y-10">
          
          {/* Section 1: Customer Details */}
          <section>
            <h3 className="font-bold text-lg mb-8">Customer Detailes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
              <DetailItem label="Company name" value="Rajesh Electronics" />
              <DetailItem label="Lead ID" value="L001" />
              <DetailItem label="Contact person" value="Arvind Sharma" />
              <DetailItem label="Designation" value="Proprietor" />
              <DetailItem label="Phone" value="+91 98765 43210" />
              <DetailItem label="Email" value="arvind@sharmaha.in" />
              <DetailItem label="GST number" value="27AABCS5678G1Z3" />
              <DetailItem label="Lead source" value="Trade Fair" />
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 2: Products of Interest */}
          <section>
            <h3 className="font-bold text-lg mb-6">Products of interest</h3>
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-[#f1f1f1] border border-gray-300 py-3 px-4 text-sm font-medium">
              <div>Product</div>
              <div className="text-center">Variant</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Est. value</div>
            </div>

            {/* Table Rows */}
            {products.map((product, idx) => (
              <div key={idx} className="grid grid-cols-4 py-6 px-4 border-b border-gray-100 text-sm items-center">
                <div className="font-medium">{product.name}</div>
                <div className="text-center text-gray-600">{product.variant}</div>
                <div className="text-center text-gray-600">{product.qty}</div>
                <div className="text-right font-medium flex justify-end items-center gap-1">
                  <span className="text-xs">₹</span> {product.value.replace('₹', '')}
                </div>
              </div>
            ))}

            {/* Summary Boxes */}
            <div className="grid grid-cols-3 mt-4 border border-gray-400 bg-[#e8e8e8] rounded-sm overflow-hidden text-center">
              <div className="py-2 border-r border-gray-400">
                <p className="text-[11px] text-gray-600 uppercase">Total quantity</p>
                <p className="font-medium text-sm">35 units</p>
              </div>
              <div className="py-2 border-r border-gray-400">
                <p className="text-[11px] text-gray-600 uppercase">Est. deal value</p>
                <p className="font-medium text-sm">₹14.8L</p>
              </div>
              <div className="py-2">
                <p className="text-[11px] text-gray-600 uppercase">Product</p>
                <p className="font-medium text-sm">2 types</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 3: Lead Details */}
          <section>
            <h3 className="font-bold text-lg mb-6">Lead details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8">
              <div className="space-y-8">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Priority</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#d9d9d9]" />
                    <span className="text-sm font-medium">Warm</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Assigned to</p>
                  <p className="text-sm font-medium">Sneha Patil</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Expected decision</p>
                  <p className="text-sm font-medium tracking-wide">31-03-2026</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Follow-up date</p>
                  <p className="text-sm font-medium tracking-wide">26-03-2026</p>
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <p className="text-xs text-gray-400 mb-2">Address</p>
                <div className="border border-gray-300 rounded-md p-4 text-sm text-[#333] leading-relaxed">
                  Vasukamal Express -2nd Floor, Rohan Sehar Ln, Pancard Club Rd, behind Beverly Hills Society, Samarth Colony, Baner, Pune, Maharashtra 411069
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 4: Pipeline Stage */}
          <section>
            <h3 className="font-bold text-lg mb-10">Pipeline stage</h3>
            <div className="relative px-2">
              {/* Connector Lines */}
              <div className="absolute top-4 left-0 w-full h-2 bg-[#e0e0e0] -z-10" />
              <div 
                className="absolute top-4 left-0 h-2 bg-[#2d2d2d] -z-10 transition-all duration-500" 
                style={{ width: '25%' }} 
              />
              
              <div className="flex justify-between items-start">
                {pipelineStages.map((stage, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${stage.completed ? 'bg-[#2d2d2d]' : 'bg-[#e0e0e0]'}`} />
                    <p className={`mt-3 text-[11px] font-medium ${stage.completed ? 'text-black' : 'text-gray-400'}`}>
                      {stage.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Section 5: Notes */}
          <section>
            <h3 className="font-bold text-lg mb-4">Notes</h3>
            <div className="bg-[#e8e8e8] p-6 rounded-md min-h-40">
              <p className="text-sm leading-relaxed text-[#1a1a1a]">
                Met at Trade Fair 2026, Pune. Interested in bulk purchase for summer season. Wants competitive pricing on refrigerators and ACs. Decision expected by end of March 2026.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

// --- Sub-component for Details ---
const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-[#1a1a1a]">{value}</p>
  </div>
);

export default LeadView;