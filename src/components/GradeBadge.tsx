import React from 'react';
import { MATERIAL_GRADES } from '@/lib/constants';

interface GradeBadgeProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const GradeBadge: React.FC<GradeBadgeProps> = ({
  grade,
  size = 'md',
  showTooltip = true,
}) => {
  const info = MATERIAL_GRADES[grade as keyof typeof MATERIAL_GRADES] || MATERIAL_GRADES.GRADE_B;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm transition-all ${info.badgeClass} ${sizeClasses[size]}`}
      title={showTooltip ? `${info.label}: ${info.description}` : undefined}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{info.label}</span>
      <span className="hidden sm:inline opacity-75 font-normal">({info.shortDesc})</span>
    </span>
  );
};
