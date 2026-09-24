import React, { useState, useId } from 'react';
import { Calculator, IndianRupee, Shield, Wrench, Zap, DollarSign, Calendar, ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function CostCalculator({ baseRent = 0, currencySymbol = '₹' }) {
  const [months, setMonths] = useState(11);
  const [depositMonths, setDepositMonths] = useState(2);
  const [maintenance, setMaintenance] = useState(Math.round(baseRent * 0.05));
  const [utilities, setUtilities] = useState(2500);
  const [serviceFee, setServiceFee] = useState(Math.round(baseRent * 0.1));
  const [otherCharges, setOtherCharges] = useState(1000); // e.g., move-in cleaning/documentation
  const [isOpen, setIsOpen] = useState(false);

  // Accessible unique IDs for form controls
  const durationInputId = useId();
  const depositInputId = useId();
  const maintenanceInputId = useId();
  const utilitiesInputId = useId();
  const serviceFeeInputId = useId();
  const otherChargesInputId = useId();

  // Calculations
  const securityDeposit = Number(baseRent) * Number(depositMonths);
  const monthlyRecurringCost = Number(baseRent) + Number(maintenance) + Number(utilities);
  const initialMoveInCost = Number(securityDeposit) + Number(baseRent) + Number(serviceFee) + Number(otherCharges);
  const totalLeaseCost = initialMoveInCost + (Number(months) - 1) * monthlyRecurringCost;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-8 transition-all hover:border-indigo-200">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              Rent & Move-in Cost Estimator
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-medium">
                Live Calculator
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Calculate upfront deposit, recurring monthly expenses, and full lease estimate
            </p>
          </div>
        </div>
        <button 
          type="button" 
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse Cost Estimator" : "Expand Cost Estimator"}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Summary Banner (Always visible) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/70 border-b border-slate-100 text-center">
        <div className="p-4">
          <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider block">
            Estimated Monthly Cost
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {currencySymbol}{monthlyRecurringCost.toLocaleString()}
            <span className="text-xs font-normal text-slate-700">/mo</span>
          </span>
        </div>
        <div className="p-4 bg-indigo-50/50">
          <span className="text-xs text-indigo-900 font-bold uppercase tracking-wider block">
            Upfront Move-In Cost
          </span>
          <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block">
            {currencySymbol}{initialMoveInCost.toLocaleString()}
          </span>
        </div>
        <div className="p-4">
          <span className="text-xs text-slate-700 font-semibold uppercase tracking-wider block">
            Total ({months} Months Lease)
          </span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
            {currencySymbol}{totalLeaseCost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Detailed Interactive Configurator */}
      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Lease Duration */}
            <div>
              <label htmlFor={durationInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Lease Duration: <span className="text-indigo-600 font-bold">{months} Months</span>
              </label>
              <input 
                id={durationInputId}
                type="range" 
                min="1" 
                max="36" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 mo</span>
                <span>11 mo (Std)</span>
                <span>24 mo</span>
                <span>36 mo</span>
              </div>
            </div>

            {/* Security Deposit Multiplier */}
            <div>
              <label htmlFor={depositInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Security Deposit: <span className="text-emerald-600 font-bold">{depositMonths} Months ({currencySymbol}{securityDeposit.toLocaleString()})</span>
              </label>
              <input 
                id={depositInputId}
                type="range" 
                min="0" 
                max="6" 
                step="0.5"
                value={depositMonths} 
                onChange={(e) => setDepositMonths(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 mo</span>
                <span>2 mo</span>
                <span>4 mo</span>
                <span>6 mo</span>
              </div>
            </div>

            {/* Monthly Maintenance */}
            <div>
              <label htmlFor={maintenanceInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                Monthly Maintenance ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">{currencySymbol}</span>
                <input 
                  id={maintenanceInputId}
                  type="number" 
                  min="0"
                  value={maintenance} 
                  onChange={(e) => setMaintenance(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Estimated Utilities */}
            <div>
              <label htmlFor={utilitiesInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Estimated Utilities / Electricity & WiFi ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">{currencySymbol}</span>
                <input 
                  id={utilitiesInputId}
                  type="number" 
                  min="0"
                  value={utilities} 
                  onChange={(e) => setUtilities(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Platform / Documentation Fee */}
            <div>
              <label htmlFor={serviceFeeInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
                One-time Service / Brokerage Fee ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">{currencySymbol}</span>
                <input 
                  id={serviceFeeInputId}
                  type="number" 
                  min="0"
                  value={serviceFee} 
                  onChange={(e) => setServiceFee(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Other Initial Charges */}
            <div>
              <label htmlFor={otherChargesInputId} className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-500" />
                Move-in Documentation / Cleaning ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">{currencySymbol}</span>
                <input 
                  id={otherChargesInputId}
                  type="number" 
                  min="0"
                  value={otherCharges} 
                  onChange={(e) => setOtherCharges(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Comprehensive Expense Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Base Monthly Rent</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{Number(baseRent).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Refundable Security Deposit ({depositMonths} mo)</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Maintenance</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{Number(maintenance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Monthly Utilities</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{Number(utilities).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>One-time Setup & Service Fee</span>
                <span className="font-semibold text-slate-900">{currencySymbol}{Number(serviceFee + otherCharges).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Upfront Amount Due at Move-in</span>
                <span className="text-indigo-600">{currencySymbol}{initialMoveInCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
