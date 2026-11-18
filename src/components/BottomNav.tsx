'use client';

import React from 'react';
import { UserRole } from '@/types';
import { BookOpen, Upload, FileText, CheckCircle2, BarChart2 } from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: 'browse' | 'upload' | 'submissions' | 'admin_queue' | 'analytics';
  onTabChange: (tab: 'browse' | 'upload' | 'submissions' | 'admin_queue' | 'analytics') => void;
  pendingCount: number;
  mySubmissionsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  pendingCount,
  mySubmissionsCount,
}) => {
  // Configured navigation items based on current active role
  const getNavItems = () => {
    if (currentRole === 'student') {
      return [
        { id: 'browse', label: 'Library', icon: BookOpen },
        { id: 'upload', label: 'Contribute', icon: Upload },
      ];
    }
    if (currentRole === 'contributor') {
      return [
        { id: 'upload', label: 'Upload Note', icon: Upload },
        { id: 'submissions', label: 'My Submissions', icon: FileText, badge: mySubmissionsCount },
        { id: 'browse', label: 'Public Library', icon: BookOpen },
      ];
    }
    // Admin / Dosen
    return [
      { id: 'admin_queue', label: 'Review Queue', icon: CheckCircle2, badge: pendingCount },
      { id: 'analytics', label: 'Learning Gaps', icon: BarChart2 },
      { id: 'browse', label: 'Student View', icon: BookOpen },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-sheet">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-academic-600 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 leading-tight tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-academic-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
