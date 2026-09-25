import React from 'react';
import { Check, X } from 'lucide-react';

export const checkPasswordCriteria = (password = '') => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

export const isPasswordStrong = (password = '') => {
  const criteria = checkPasswordCriteria(password);
  return (
    criteria.minLength &&
    criteria.hasUppercase &&
    criteria.hasLowercase &&
    criteria.hasNumber &&
    criteria.hasSpecial
  );
};

export const getPasswordStrength = (password = '') => {
  if (!password) return { label: '', score: 0, passedCount: 0 };
  const criteria = checkPasswordCriteria(password);
  const passedCount = Object.values(criteria).filter(Boolean).length;

  if (passedCount === 5) {
    return { label: 'Strong', score: 3, passedCount };
  }
  if (passedCount >= 3) {
    return { label: 'Medium', score: 2, passedCount };
  }
  return { label: 'Weak', score: 1, passedCount };
};

export default function PasswordStrengthIndicator({ password = '', showRequirements = true }) {
  if (!password && !showRequirements) return null;

  const criteria = checkPasswordCriteria(password);
  const strength = getPasswordStrength(password);

  const requirements = [
    { label: 'At least 8 characters', met: criteria.minLength },
    { label: 'One uppercase letter (A–Z)', met: criteria.hasUppercase },
    { label: 'One lowercase letter (a–z)', met: criteria.hasLowercase },
    { label: 'One number (0–9)', met: criteria.hasNumber },
    { label: 'One special character (!@#$%^&*)', met: criteria.hasSpecial },
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Strength Bar & Label */}
      {password && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#71717a] dark:text-[#a1a1aa] font-medium">Security Strength</span>
            <span
              className={`font-bold uppercase tracking-wider text-[10px] ${
                strength.label === 'Strong'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : strength.label === 'Medium'
                  ? 'text-[#b58d59] dark:text-[#d4b996]'
                  : 'text-amber-700 dark:text-amber-400'
              }`}
            >
              {strength.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 h-1.5">
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 1
                  ? strength.score === 1
                    ? 'bg-amber-500/80 dark:bg-amber-500'
                    : strength.score === 2
                    ? 'bg-[#b58d59] dark:bg-[#d4b996]'
                    : 'bg-emerald-600 dark:bg-emerald-400'
                  : 'bg-[#e5e0d8] dark:bg-[#27272a]'
              }`}
            />
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score >= 2
                  ? strength.score === 2
                    ? 'bg-[#b58d59] dark:bg-[#d4b996]'
                    : 'bg-emerald-600 dark:bg-emerald-400'
                  : 'bg-[#e5e0d8] dark:bg-[#27272a]'
              }`}
            />
            <div
              className={`rounded-full transition-all duration-300 ${
                strength.score === 3
                  ? 'bg-emerald-600 dark:bg-emerald-400'
                  : 'bg-[#e5e0d8] dark:bg-[#27272a]'
              }`}
            />
          </div>
        </div>
      )}

      {/* Checklist Requirements */}
      {showRequirements && (
        <div className="p-3.5 rounded-xl bg-[#f8f6f0] dark:bg-[#18181b] border border-[#e5e0d8] dark:border-[#27272a] space-y-2 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#71717a] dark:text-[#a1a1aa]">
            Password must contain:
          </p>
          <ul className="space-y-1.5 text-[11px]">
            {requirements.map((req, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-2 transition-colors duration-200 ${
                  req.met
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-[#71717a] dark:text-[#a1a1aa]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] transition-all ${
                    req.met
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-[#e8e3da] dark:bg-[#27272a] text-[#a1a1aa] dark:text-[#71717a]'
                  }`}
                >
                  {req.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                </span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
