'use client';

import React from 'react';
import { UserRole } from '@/types';
import { GraduationCap, UploadCloud, ShieldCheck } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingCount?: number;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  currentRole,
  onRoleChange,
  pendingCount = 0,
}) => {
  const roles: { id: UserRole; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'student',
      label: 'Student',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    {
      id: 'contributor',
      label: 'Contributor',
      icon: <UploadCloud className="w-3.5 h-3.5" />,
    },
    {
      id: 'admin',
      label: 'Admin / Dosen',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
  ];

  return (
    <div className="bg-slate-100/90 p-1 rounded-full border border-slate-200/90 flex items-center shadow-inner">
      {roles.map((r) => {
        const isActive = currentRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => onRoleChange(r.id)}
            className={`relative flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
            }`}
          >
            <span className={isActive ? 'text-academic-600' : 'text-slate-400'}>{r.icon}</span>
            <span>{r.label}</span>
            {r.badge !== undefined && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {r.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
