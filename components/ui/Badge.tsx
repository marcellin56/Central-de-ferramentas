import React from 'react';
import { ToolStatus } from '../../types.ts';

interface BadgeProps {
  status: ToolStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  // Glassmorphism styles: translucent background, blur, and subtle border
  const styles = {
    active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]",
    maintenance: "bg-amber-500/10 text-amber-700 border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]",
    beta: "bg-purple-500/10 text-purple-700 border-purple-500/20 shadow-[0_2px_10px_rgba(168,85,247,0.1)]",
    coming_soon: "bg-slate-500/10 text-slate-600 border-slate-500/20 shadow-[0_2px_10px_rgba(100,116,139,0.1)]",
  };

  // Micro-copy improvement: More descriptive status text
  const labels = {
    active: "Sistema Operacional",
    maintenance: "Em Manutenção",
    beta: "Versão Beta",
    coming_soon: "Em Breve",
  };

  return (
    <span className={`
      backdrop-blur-md border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
      flex items-center gap-1.5 transition-transform duration-300 hover:scale-105
      ${styles[status]}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-current animate-pulse' : 'bg-current'}`}></span>
      {labels[status]}
    </span>
  );
};