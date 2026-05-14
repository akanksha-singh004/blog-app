"use client";

import { useState } from "react";
import { LifeBuoy, Send } from "lucide-react";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for support ticket
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1] text-white">
          <LifeBuoy size={20} />
        </div>
        <h1 className="text-2xl font-bold text-[#1e293b]">Help & Support</h1>
      </div>

      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
        {sent ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
              <Send size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#1e293b]">Message Sent Successfully!</h3>
            <p className="text-sm text-[#64748b]">Our support team will get back to you within 24 hours.</p>
            <button 
              onClick={() => setSent(false)}
              className="mt-6 rounded-xl bg-[#f8f9ff] px-6 py-2.5 text-sm font-bold text-[#6366f1] transition-all hover:bg-[#eef0ff]"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-[#64748b] mb-6">
              Experiencing an issue with Blogsy? Fill out the form below and we'll help you get it sorted out as soon as possible.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Topic</label>
                <select className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10">
                  <option>General Inquiry</option>
                  <option>Billing & Subscriptions</option>
                  <option>Technical Issue</option>
                  <option>Report Abuse</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Priority</label>
                <select className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1e293b]">Message</label>
              <textarea
                className="w-full rounded-xl border border-[#e2e8f0] bg-[#f8f9ff] px-4 py-3 outline-none transition-all focus:border-[#6366f1] focus:bg-white focus:ring-2 focus:ring-[#6366f1]/10"
                rows={6}
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f46e5] disabled:opacity-50 w-full md:w-auto"
            >
              {loading ? "Sending..." : "Submit Support Ticket"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
