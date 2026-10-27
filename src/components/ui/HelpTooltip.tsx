import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  content: string;
  className?: string;
  title?: string;
}

export function HelpTooltip({ content, className = '', title }: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShow((prev) => !prev);
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-gray-400 hover:text-[#65A30D] transition-colors p-0.5 rounded cursor-help"
        aria-label="Ver ajuda"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {show && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-56 p-2.5 bg-gray-900 text-white text-[11px] font-normal leading-relaxed rounded-xl shadow-xl z-50 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {title && <span className="font-bold text-lime-400 block mb-0.5">{title}</span>}
          <span>{content}</span>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
}
