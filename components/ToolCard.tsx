import React from 'react';
import { Tool } from '../types.ts';
import { Badge } from './ui/Badge.tsx';
import { Star, Play, ExternalLink, Zap } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
  onOpen: (tool: Tool) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpen, onToggleFavorite, isFavorite }) => {
  const isComingSoon = tool.status === 'coming_soon';

  return (
    <div 
      onClick={() => !isComingSoon && onOpen(tool)}
      className={`
        group relative flex flex-col w-full h-full
        rounded-[2rem] 
        transition-all duration-500 ease-out
        ${isComingSoon 
          ? 'opacity-70 cursor-not-allowed grayscale-[0.8]' 
          : 'cursor-pointer hover:-translate-y-2'
        }
      `}
    >
      {/* 
        GLASSMORPHISM CONTAINER 
        Multiple layers of shadows and borders to create depth and the "frosted glass" look.
        Added dark mode variants.
      */}
      <div className={`
        absolute inset-0 rounded-[2rem] bg-white/60 dark:bg-slate-800/40 backdrop-blur-xl border border-white/40 dark:border-white/10
        shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        group-hover:shadow-[0_20px_50px_-12px_rgba(19,218,135,0.2)] dark:group-hover:shadow-[0_20px_50px_-12px_rgba(19,218,135,0.1)]
        group-hover:border-brand-500/30 dark:group-hover:border-brand-500/20
        transition-all duration-500
      `}></div>

      {/* Decorative Shine Gradient (Top Left) */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-400/30 dark:group-hover:bg-brand-500/20 transition-colors duration-500"></div>

      {/* CARD CONTENT */}
      <div className="relative flex flex-col h-full z-10 p-3">
        
        {/* PREVIEW AREA (The "Window") */}
        <div className="relative h-44 w-full rounded-[1.5rem] overflow-hidden shadow-inner border border-white/50 dark:border-white/10 bg-slate-50 dark:bg-slate-800">
          {/* Image with Parallax/Zoom Effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ 
                backgroundImage: `url(${tool.image || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=NexusHub'})` 
            }}
          />
          
          {/* Glass Overlay on Image (Reflection) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-white/10 opacity-60 transition-opacity group-hover:opacity-40" />

          {/* Status Badge - Floating */}
          <div className="absolute top-3 left-3">
             <Badge status={tool.status} />
          </div>

          {/* Favorite Action - Skeuomorphic Button */}
          {!isComingSoon && (
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(tool.id);
                }}
                className={`
                    absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md border border-white/30 shadow-lg transition-all duration-300 active:scale-90
                    ${isFavorite 
                        ? 'bg-white/80 dark:bg-slate-800/80 text-amber-400 shadow-amber-500/20' 
                        : 'bg-black/20 text-white hover:bg-white dark:hover:bg-slate-800 hover:text-amber-400'
                    }
                `}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
                <Star size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* BODY AREA - SIMPLIFIED */}
        <div className="px-4 pt-5 pb-3 flex-1 flex flex-col relative">
            
            {/* TEXT & INFO - Title Only */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {tool.name}
                </h3>
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                {/* Tech Info */}
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        AMBIENTE
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        {tool.type === 'iframe' ? <Zap size={10} className="text-brand-500"/> : <ExternalLink size={10} className="text-blue-500"/>}
                        {tool.type === 'iframe' ? 'Integrado' : 'Link Externo'}
                    </span>
                </div>

                {/* Call to Action Button */}
                {!isComingSoon && (
                    <div className={`
                        flex items-center gap-2 pl-4 pr-3 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-brand-500/30
                        bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all duration-300 transform translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0
                    `}>
                        <span>Iniciar</span>
                        <div className="bg-white/20 rounded-full p-0.5">
                            <Play size={10} fill="currentColor" />
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};