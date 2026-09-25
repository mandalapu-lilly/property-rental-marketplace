import React, { useState, useId } from 'react';
import { Calculator, Shield, Wrench, Zap, DollarSign, Calendar, ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function CostCalculator({ baseRent = 0, currencySymbol = '₹' }) {
  const [months, setMonths] = useState(11);
  const [depositMonths, setDepositMonths] = useState(2);
  const [maintenance, setMaintenance] = useState(Math.round(baseRent * 0.05));
  const [utilities, setUtilities] = useState(2500);
  const [serviceFee, setServiceFee] = useState(Math.round(baseRent * 0.1));
  const [otherCharges, setOtherCharges] = useState(1000);
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
    <div className="bg-white dark:bg-[#1c1c20] rounded-[32px] border border-[#e5e0d8] dark:border-[#27272a] shadow-editorial overflow-hidden mb-8 transition-all hover:border-[#b58d59]/50">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 sm:p-7 bg-[#18181b] dark:bg-[#121214] text-white flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#27272a] border border-[#3f3f46] flex items-center justify-center text-[#d4b996]">
            <Calculator className="w-6 h-6 text-[#d4b996]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base sm:text-lg text-white">
                Rent & Move-in Cost Estimator
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#b58d59]/20 text-[#d4b996] border border-[#b58d59]/40 font-bold uppercase tracking-wider">
                Live Calculator
              </span>
            </div>
            <p className="text-xs text-[#a1a1aa] mt-0.5">
              Estimate upfront move-in deposits, recurring utility bills, and entire lease expense
            </p>
          </div>
        </div>
        <button 
          type="button" 
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse Cost Estimator" : "Expand Cost Estimator"}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e8e3da] dark:divide-[#27272a] bg-[#fbfbf9] dark:bg-[#18181b]/50 border-b border-[#e8e3da] dark:border-[#27272a] text-center">
        <div className="p-5">
          <span className="text-[11px] text-[#8c827a] dark:text-[#a1a1aa] font-bold uppercase tracking-wider block">
            Estimated Monthly Cost
          </span>
          <span className="text-xl font-black text-[#18181b] dark:text-[#fbfbf9] mt-1 block">
            {currencySymbol}{monthlyRecurringCost.toLocaleString()}
            <span className="text-xs font-normal text-[#8c827a] dark:text-[#a1a1aa]">/mo</span>
          </span>
        </div>
        <div className="p-5 bg-[#f4f0e8] dark:bg-[#27272a]/60">
          <span className="text-[11px] text-[#b58d59] dark:text-[#d4b996] font-bold uppercase tracking-wider block">
            Upfront Move-In Total
          </span>
          <span className="text-xl font-black text-[#18181b] dark:text-[#d4b996] mt-1 block">
            {currencySymbol}{initialMoveInCost.toLocaleString()}
          </span>
        </div>
        <div className="p-5">
          <span className="text-[11px] text-[#8c827a] dark:text-[#a1a1aa] font-bold uppercase tracking-wider block">
            Full Lease ({months} Months)
          </span>
          <span className="text-xl font-black text-[#18181b] dark:text-[#fbfbf9] mt-1 block">
            {currencySymbol}{totalLeaseCost.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Detailed Interactive Configurator */}
      {isOpen && (
        <div className="p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lease Duration */}
            <div className="space-y-2">
              <label htmlFor={durationInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
                Lease Term: <span className="text-[#b58d59] dark:text-[#d4b996]">{months} Months</span>
              </label>
              <input 
                id={durationInputId}
                type="range" 
                min="1" 
                max="36" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full accent-[#18181b] dark:accent-[#d4b996] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8c827a] dark:text-[#a1a1aa] font-medium">
                <span>1 mo</span>
                <span>11 mo (Std)</span>
                <span>24 mo</span>
                <span>36 mo</span>
              </div>
            </div>

            {/* Security Deposit Multiplier */}
            <div className="space-y-2">
              <label htmlFor={depositInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Security Deposit: <span className="text-emerald-600 dark:text-emerald-400">{depositMonths} Months ({currencySymbol}{securityDeposit.toLocaleString()})</span>
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
              <div className="flex justify-between text-[11px] text-[#8c827a] dark:text-[#a1a1aa] font-medium">
                <span>0 mo</span>
                <span>2 mo</span>
                <span>4 mo</span>
                <span>6 mo</span>
              </div>
            </div>

            {/* Monthly Maintenance */}
            <div className="space-y-1.5">
              <label htmlFor={maintenanceInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-500" />
                Monthly Maintenance ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c827a] text-xs font-bold">{currencySymbol}</span>
                <input 
                  id={maintenanceInputId}
                  type="number" 
                  min="0"
                  value={maintenance} 
                  onChange={(e) => setMaintenance(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                />
              </div>
            </div>

            {/* Estimated Utilities */}
            <div className="space-y-1.5">
              <label htmlFor={utilitiesInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Estimated Utilities & WiFi ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c827a] text-xs font-bold">{currencySymbol}</span>
                <input 
                  id={utilitiesInputId}
                  type="number" 
                  min="0"
                  value={utilities} 
                  onChange={(e) => setUtilities(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                />
              </div>
            </div>

            {/* Platform / Documentation Fee */}
            <div className="space-y-1.5">
              <label htmlFor={serviceFeeInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#b58d59] dark:text-[#d4b996]" />
                One-time Service Fee ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c827a] text-xs font-bold">{currencySymbol}</span>
                <input 
                  id={serviceFeeInputId}
                  type="number" 
                  min="0"
                  value={serviceFee} 
                  onChange={(e) => setServiceFee(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                />
              </div>
            </div>

            {/* Other Initial Charges */}
            <div className="space-y-1.5">
              <label htmlFor={otherChargesInputId} className="block text-xs font-bold text-[#18181b] dark:text-[#fbfbf9] uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#8c827a] dark:text-[#a1a1aa]" />
                Move-in Cleaning & Setup ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c827a] text-xs font-bold">{currencySymbol}</span>
                <input 
                  id={otherChargesInputId}
                  type="number" 
                  min="0"
                  value={otherCharges} 
                  onChange={(e) => setOtherCharges(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-[#e5e0d8] dark:border-[#27272a] bg-[#fbfbf9] dark:bg-[#141417] focus:outline-none focus:ring-2 focus:ring-[#b58d59] text-[#18181b] dark:text-[#fbfbf9]"
                />
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-[#fbfbf9] dark:bg-[#141417] rounded-2xl p-5 border border-[#e8e3da] dark:border-[#27272a] space-y-2.5">
            <h4 className="text-[11px] font-bold text-[#8c827a] dark:text-[#a1a1aa] uppercase tracking-wider">
              Expense Itemization
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#52525b] dark:text-[#d4d4d8]">
                <span>Base Monthly Rent</span>
                <span className="font-bold text-[#18181b] dark:text-[#fbfbf9]">{currencySymbol}{Number(baseRent).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#52525b] dark:text-[#d4d4d8]">
                <span>Refundable Security Deposit ({depositMonths} mo)</span>
                <span className="font-bold text-[#18181b] dark:text-[#fbfbf9]">{currencySymbol}{securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#52525b] dark:text-[#d4d4d8]">
                <span>Monthly Maintenance</span>
                <span className="font-bold text-[#18181b] dark:text-[#fbfbf9]">{currencySymbol}{Number(maintenance).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#52525b] dark:text-[#d4d4d8]">
                <span>Monthly Utilities</span>
                <span className="font-bold text-[#18181b] dark:text-[#fbfbf9]">{currencySymbol}{Number(utilities).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#52525b] dark:text-[#d4d4d8]">
                <span>One-time Setup & Service Fee</span>
                <span className="font-bold text-[#18181b] dark:text-[#fbfbf9]">{currencySymbol}{Number(serviceFee + otherCharges).toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#e8e3da] dark:border-[#27272a] flex justify-between font-bold text-[#18181b] dark:text-[#fbfbf9] text-sm">
                <span>Upfront Due at Move-in</span>
                <span className="text-[#18181b] dark:text-[#d4b996] font-black">{currencySymbol}{initialMoveInCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
