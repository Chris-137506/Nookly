'use client';

import React from 'react';
import { UserRole } from '@/types';
import { RoleSwitcher } from './RoleSwitcher';
import { BookOpen, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  pendingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  pendingCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-4xl mx-auto">
        {/* Brand identity */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-academic-600 text-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold tracking-tight text-slate-900 text-base">Nookly</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-blue-50 text-academic-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                  UNESA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-none mt-0.5">
                FMIPA S1 Sains Data
              </p>
            </div>
          </div>

          {/* Mobile role indicator pill */}
          <div className="sm:hidden flex items-center space-x-1 text-[11px] text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
            <Sparkles className="w-3 h-3 text-academic-600" />
            <span className="capitalize">{currentRole}</span>
          </div>
        </div>

        {/* Floating/Header Role Switcher */}
        <div className="w-full sm:w-auto flex justify-center">
          <RoleSwitcher
            currentRole={currentRole}
            onRoleChange={onRoleChange}
            pendingCount={pendingCount}
          />
        </div>
      </div>
    </header>
  );
};
