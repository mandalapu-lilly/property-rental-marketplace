import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';

export default function ReviewStats({ reviews = [], averageRating = 0, totalReviews = 0 }) {
  // Compute star breakdown
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    counts[star] = (counts[star] || 0) + 1;
  });

  const validTotal = totalReviews || reviews.length || 1;

  return (
    <div className="bg-[#fbfbf9] dark:bg-[#1c1c20] rounded-2xl border border-[#e5e0d8] dark:border-[#27272a] p-5 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Overall Rating Score */}
        <div className="text-center md:border-r border-[#e8e3da] dark:border-[#27272a] md:pr-6">
          <div className="text-4xl font-extrabold text-[#18181b] dark:text-[#fbfbf9] tracking-tight">
            {averageRating ? averageRating.toFixed(1) : '5.0'}
          </div>
          <div className="flex items-center justify-center gap-1 my-1.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(averageRating || 5) ? 'fill-amber-400 text-amber-400' : 'text-[#d4cdc3] dark:text-[#3f3f46]'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#71717a] dark:text-[#a1a1aa] font-medium">
            Based on {totalReviews || reviews.length} verified tenant review{(totalReviews || reviews.length) === 1 ? '' : 's'}
          </p>
        </div>

        {/* Rating Distribution Bars */}
        <div className="md:col-span-2 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = counts[stars] || 0;
            const percentage = Math.round((count / validTotal) * 100);
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="font-semibold text-[#18181b] dark:text-[#fbfbf9] w-8 flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 bg-[#e5e0d8] dark:bg-[#27272a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#b58d59] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[#71717a] dark:text-[#a1a1aa] w-10 text-right font-medium">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
