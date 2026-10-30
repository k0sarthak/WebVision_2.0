import React, { useState } from 'react';
import { 
  Ticket, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  ShieldAlert, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  IndianRupee,
  ChevronDown
} from 'lucide-react';
import { Language } from '../types';

interface TicketingHubPageProps {
  language: Language;
}

export const TicketingHubPage: React.FC<TicketingHubPageProps> = ({ language }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How can I purchase a paperless mobile QR ticket?",
      a: "Mobile QR tickets can be generated directly via the official DMRC Momentum 2.0 app, WhatsApp ticketing chatbot (+91 9650855800), Paytm, or Amazon Pay. Simply select your origin and destination stations, scan the QR code at AFC gates with dedicated scanners, and proceed."
    },
    {
      q: "What discounts are available with DMRC Smart Cards and NCMC cards?",
      a: "Regular Smart Card and National Common Mobility Card (RuPay NCMC) holders receive an automatic 10% discount on every journey compared to token fares. In addition, an extra 10% discount (totaling 20% off) is applied during designated off-peak hours: before 8:00 AM, between 12:00 PM – 5:00 PM, and after 9:00 PM (Monday through Saturday)."
    },
    {
      q: "What is the Sunday and National Holiday concessional fare?",
      a: "On Sundays and recognized National Holidays (such as Republic Day, Independence Day, and Gandhi Jayanti), a special flat concessional fare applies across the network. Journeys between 2-5 km drop from ₹21 to ₹11, and journeys over 32 km drop to ₹54."
    },
    {
      q: "Where can I recharge my physical DMRC Smart Card?",
      a: "You can recharge your Smart Card at station Ticket Vending Machines (TVMs), Customer Care counters, or online through the DMRC website and UPI apps. Note that after online recharge, the card must be tapped on an AVM (Add Value Machine) at any metro station to update the balance."
    },
    {
      q: "What is the minimum balance required to travel on Delhi Metro?",
      a: "A minimum balance of ₹50 is required on your Smart Card to initiate entry at any AFC automatic gate."
    }
  ];

  const fareSlabs = [
    { slab: "0 – 2 km", token: "₹11", card: "₹10", sunday: "₹11" },
    { slab: "2 – 5 km", token: "₹21", card: "₹19", sunday: "₹11" },
    { slab: "5 – 12 km", token: "₹32", card: "₹29", sunday: "₹21" },
    { slab: "12 – 21 km", token: "₹43", card: "₹39", sunday: "₹32" },
    { slab: "21 – 32 km", token: "₹54", card: "₹49", sunday: "₹43" },
    { slab: "More than 32 km", token: "₹64", card: "₹58", sunday: "₹54" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2">
          <Ticket className="w-4 h-4" />
          <span>Official Fare Rules & Ticketing Directory</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {language === 'hi' ? 'स्मार्ट टिकटिंग हब एवं किराया गाइड' : 'Smart Ticketing Hub & Fare Guide'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {language === 'hi'
            ? 'मोबाइल QR टिकटिंग, स्मार्ट कार्ड छूट, एनसीएमसी कार्ड और आधिकारिक किराया तालिका'
            : 'Explore contactless QR ticketing, Smart Card off-peak discounts, NCMC auto top-up, and official fare matrices.'}
        </p>
      </div>

      {/* Mandatory Prototype Transparency Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              PROTOTYPE NOTICE
            </span>
            <span className="text-xs font-semibold text-amber-900">
              No Real Financial Transactions Processed Here
            </span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            DMRC ONE is an educational and hackathon platform prototype. It does not process financial transactions or issue live AFC QR tokens. For official ticket purchase and card recharge, please use the verified channels detailed below.
          </p>
        </div>
      </div>

      {/* 3 Ticketing Modalities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* QR Tickets */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-dmrc-red flex items-center justify-center">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Paperless Mobile QR Tickets</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Skip station queues with contactless digital barcodes valid across all automatic entry/exit turnstiles.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>DMRC Momentum 2.0 (Official App)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>WhatsApp QR (+91 9650855800)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Paytm & Amazon Pay Metro QR</span>
            </li>
          </ul>
        </div>

        {/* DMRC Smart Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">DMRC Smart Card</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              The preferred choice for daily commuters offering 10% standard discount and 20% off-peak savings.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Refundable Security Deposit: ₹50</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>20% off-peak discount (before 8 AM, 12-5 PM, after 9 PM)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Recharge via TVM, UPI or Customer Care</span>
            </li>
          </ul>
        </div>

        {/* NCMC Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">National Common Mobility (NCMC)</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Interoperable RuPay card enabling seamless travel across Delhi Metro, DTC buses, and Indian transit systems.
            </p>
          </div>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Issued by major Indian banks (SBI, PNB, etc.)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tap & Go enabled at all AFC gates</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Auto debit from bank balance</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Official Fare Structure Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            <span>Official Distance & Fare Slabs</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard token fares versus Smart Card 10% concessions and Sunday flat tariffs
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-4 font-bold">Distance Slab</th>
                <th className="py-3 px-4 font-bold">Standard Token / QR (Mon–Sat)</th>
                <th className="py-3 px-4 font-bold">Smart Card (10% Discount)</th>
                <th className="py-3 px-4 font-bold">Sunday & National Holiday Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fareSlabs.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{row.slab}</td>
                  <td className="py-3 px-4 text-slate-700 font-bold">{row.token}</td>
                  <td className="py-3 px-4 text-emerald-700 font-bold">{row.card}</td>
                  <td className="py-3 px-4 text-blue-700 font-bold">{row.sunday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div>• <strong>Airport Express Line:</strong> Special dedicated slab structure applies (₹11 to ₹75).</div>
          <div>• <strong>Smart Card Off-Peak:</strong> An extra 10% discount (20% total) applies before 08:00 AM, 12:00–17:00, and after 21:00 on weekdays.</div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-dmrc-red" />
          <span>Frequently Asked Ticketing Questions</span>
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:text-dmrc-red transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

