import React from 'react';
import { Database, Info } from 'lucide-react';

interface DemoBadgeProps {
  className?: string;
  compact?: boolean;
}

export function DemoBadge({ className = '', compact = false }: DemoBadgeProps) {
  if (compact) {
    return (
      <span
        title="Este sistema opera em modo de demonstração. Dados agrícolas, meteorológicos e de satélite são fictícios e ilustrativos."
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 tracking-wide select-none ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] animate-pulse"></span>
        Dados demonstrativos
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-lime-50 text-lime-900 border border-lime-200/70 text-xs font-medium ${className}`}
    >
      <Database className="w-3.5 h-3.5 text-[#65A30D]" />
      <span>Dados demonstrativos</span>
      <span
        title="Dados simulados para Huambo, Huíla e Malanje preparados para integração com backend futuro."
        className="cursor-help text-lime-700 hover:text-lime-900 ml-0.5"
      >
        <Info className="w-3 h-3 inline" />
      </span>
    </div>
  );
}
