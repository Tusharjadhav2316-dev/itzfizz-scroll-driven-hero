"use client";

import React from "react";
import { StatItem } from "@/types";

interface StatCardProps {
  stat: StatItem;
  className?: string;
  style?: React.CSSProperties;
}

export const StatCard: React.FC<StatCardProps> = ({
  stat,
  className = "",
  style,
}) => {
  return (
    <div
      id={stat.id}
      style={style}
      className={`text-box group relative rounded-xl border border-zinc-800/80 bg-zinc-950/85 p-5 md:p-6 shadow-2xl backdrop-blur-md transition-colors duration-200 hover:border-emerald-500/40 hover:bg-zinc-900/90 ${className}`}
    >
      {/* Subtle top accent highlight */}
      <div className="absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* Metric header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="num-box text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
          {stat.value}
        </span>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm font-medium text-zinc-300 leading-snug">
        {stat.label}
      </p>

      {stat.sublabel && (
        <span className="mt-1 block text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
          {stat.sublabel}
        </span>
      )}
    </div>
  );
};

export default StatCard;
