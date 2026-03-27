import React, { useState, useEffect } from "react";
import {
  ChevronDown,
} from "lucide-react";

/* ✅ TYPES */

interface FormData {
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

interface Product {
  id: number;
  product: string;
  variant: string;
  quantity: number;
  unit: string;
  estValue: number;
  assignedTo: string;
}

interface Summary {
  totalQty: number;
  totalValue: number;
}

type InputFieldProps = {
  label: string;
  name: keyof FormData;
  placeholder: string;
  type?: string;
  required?: boolean;
};

type SelectFieldProps = {
  label: string;
  options: string[];
  placeholder: string;
};

/* ✅ COMPONENT */

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    contactPerson: "",
    designation: "Owner",
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
    address:
      "Vasukamal Express - 2nd Floor, Baner, Pune, Maharashtra 411069",
    notes: "",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: Date.now(),
      product: "",
      variant: "Advance",
      quantity: 1,
      unit: "Unit (approx.)",
      estValue: 7.2,
      assignedTo: "",
    },
  ]);

  const [_summary, setSummary] = useState<Summary>({
    totalQty: 0,
    totalValue: 0,
  });

  /* ✅ CALCULATIONS */
  useEffect(() => {
    const qty = products.reduce((acc, curr) => acc + curr.quantity, 0);
    const val = products.reduce(
      (acc, curr) => acc + curr.quantity * curr.estValue,
      0
    );

    setSummary({
      totalQty: qty,
      totalValue: Number(val.toFixed(1)),
    });
  }, [products]);

  /* ✅ HANDLERS */

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const _handleProductChange = (
    id: number,
    field: keyof Product,
    value: string | number
  ): void => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                field === "quantity" || field === "estValue"
                  ? Number(value)
                  : value,
            }
          : p
      )
    );
  };

  const _addProduct = (): void => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        product: "",
        variant: "Advance",
        quantity: 1,
        unit: "Unit (approx.)",
        estValue: 0,
        assignedTo: "",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Saving Lead:", { ...formData, products });
    alert("Lead saved successfully!");
  };

  /* ✅ REUSABLE COMPONENTS */

  const _InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    placeholder,
    type = "text",
    required = false,
  }) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="bg-[#E9E9E9] rounded-md p-2.5 text-sm outline-none"
      />
    </div>
  );

  const _SelectField: React.FC<SelectFieldProps> = ({
    label,
    options,
    placeholder,
  }) => (
    <div className="flex flex-col gap-1.5 w-full relative">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select className="bg-[#E9E9E9] rounded-md p-2.5 text-sm w-full appearance-none">
          <option value="">{placeholder}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 max-w-6xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* UI same as your code — no change */}
        <button type="submit">Save Lead</button>
      </form>
    </div>
  );
};

export default LeadForm;