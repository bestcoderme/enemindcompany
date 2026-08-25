import React from 'react';
import { Home, GraduationCap, Briefcase, Building2, User } from 'lucide-react';

interface EnemindBottomNavProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
}

export const EnemindBottomNav: React.FC<EnemindBottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'opportunities', label: 'Jobs', icon: Briefcase },
    { id: 'campus', label: 'Campus', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-1.5 px-2 md:hidden flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-emerald-600 font-bold' : 'text-neutral-500 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-600' : 'text-neutral-500'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
