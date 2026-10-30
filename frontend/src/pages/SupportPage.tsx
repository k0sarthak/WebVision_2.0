import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  AlertCircle, 
  Send, 
  MapPin, 
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';

interface SupportPageProps {
  language: Language;
}

export const SupportPage: React.FC<SupportPageProps> = ({ language }) => {
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Cleanliness',
    station: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComplaintSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <PhoneCall className="w-4 h-4" />
          <span>Passenger Care & Assistance</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'सहायता एवं यात्री सेवा केंद्र' : 'Help & Passenger Support'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'खोया-पाया विभाग, 24x7 सुरक्षा हेल्पलाइन, और यात्री सहायता निर्देशिका'
            : '24x7 emergency helplines, Lost & Found guidelines, and passenger assistance channels.'}
        </p>
      </div>

      {/* Emergency Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-dmrc-red flex items-center justify-center font-bold text-lg">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">24x7 Passenger Helpline</h3>
            <div className="text-2xl font-black text-dmrc-red mt-1">155370</div>
            <p className="text-xs text-slate-500 mt-1">Toll-free customer assistance, train schedules, and station inquiries.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Women Passenger Helpline</h3>
            <div className="text-2xl font-black text-rose-600 mt-1">1091</div>
            <p className="text-xs text-slate-500 mt-1">Dedicated priority safety hotline and quick response team.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">CISF Security Control Room</h3>
            <div className="text-xl font-bold text-blue-600 mt-1">011-23417910</div>
            <p className="text-xs text-slate-500 mt-1">Central Industrial Security Force 24/7 security dispatch center.</p>
          </div>
        </div>
      </div>

      {/* Lost & Found Guidelines Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-dmrc-red" />
          <span>Lost & Found Office (Kashmere Gate)</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          If you have misplaced personal belongings on a train or station premises, items are safely collected and routed to the <strong>Centralized Lost & Found Office</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <strong className="text-slate-900 block font-bold">Office Location & Hours:</strong>
            <div>Concourse Level, Kashmere Gate Metro Station (Gate No. 1)</div>
            <div className="text-slate-500">Operating Hours: Monday – Saturday (08:00 AM – 08:00 PM)</div>
            <div className="text-slate-500">Contact: 011-23860837</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <strong className="text-slate-900 block font-bold">Retrieval Requirements:</strong>
            <div>1. Government-issued Photo ID (Aadhaar / Voter ID / Passport)</div>
            <div>2. Precise description of the article and train/station details</div>
            <div>3. Contact number and signature verification</div>
          </div>
        </div>
      </div>

      {/* Passenger Feedback / Complaint Demo Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Passenger Feedback & Inquiries Form</h2>
            <p className="text-xs text-slate-500 mt-0.5">Submit service queries or experience feedback</p>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
            DEMO FORM
          </span>
        </div>

        {complaintSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900">Feedback Recorded (Demo)</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Your feedback reference token <strong>#DMRC-HACK-8492</strong> has been generated in prototype mode.
            </p>
            <button
              onClick={() => setComplaintSubmitted(false)}
              className="mt-2 text-xs font-bold text-emerald-800 underline"
            >
              Submit another feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarthak Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 98XXXXXXXX"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="Cleanliness">Cleanliness & Station Hygiene</option>
                  <option value="Ticketing">AFC Gate & QR Ticketing</option>
                  <option value="Accessibility">Lift & Escalator Operation</option>
                  <option value="Security">Security & CISF Assistance</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Station Name</label>
                <input
                  type="text"
                  value={formData.station}
                  onChange={e => setFormData({ ...formData, station: e.target.value })}
                  placeholder="e.g. Rajiv Chowk"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Details</label>
              <textarea
                rows={3}
                required
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
                placeholder="Describe your feedback or question..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-dmrc-red text-white text-xs font-bold transition-colors shadow-xs"
            >
              Submit Feedback (Demo Prototype)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

