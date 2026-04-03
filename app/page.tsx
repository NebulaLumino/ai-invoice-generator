"use client";

import { useState } from "react";

export default function InvoiceGeneratorPage() {
  const [clientName, setClientName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !serviceDescription.trim() || !amount.trim()) {
      setError("Please fill in client name, service description, and amount.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");
    const prompt = `Client Name: ${clientName}
Service Description: ${serviceDescription}
Amount: ${amount}
Due Date: ${dueDate}
Payment Terms: ${paymentTerms}
Currency: ${currency}`;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.output);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "hsl(270, 70%, 65%)" }}>
            AI Invoice & Accounts Receivable Generator
          </h1>
          <p className="text-gray-400">
            Generate professional invoices with payment reminders, AR aging reports, and late fee policies.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Client Name *</label>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client or company name" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Service Description *</label>
            <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Describe the services or products provided..." rows={3} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount *</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 5000.00" type="number" step="0.01" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
            <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Payment Terms</label>
            <select value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-violet-500 transition-colors">
              <option value="">Select payment terms</option>
              <option>Due on Receipt</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Net 45</option>
              <option>Net 60</option>
              <option>Net 90</option>
              <option>50% Upfront, 50% on Completion</option>
              <option>Monthly Retainer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-violet-500 transition-colors">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>CAD</option>
              <option>AUD</option>
              <option>JPY</option>
              <option>CHF</option>
              <option>INR</option>
            </select>
          </div>
          {error && <p className="text-sm" style={{ color: "hsl(270, 70%, 65%)" }}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "hsl(270, 70%, 55%)" }}>
            {loading ? "Generating Invoice Package..." : "Generate Invoice & AR Package"}
          </button>
        </form>

        {output && (
          <div className="mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="prose prose-invert prose-sm max-w-none text-gray-200 whitespace-pre-wrap">{output}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
