import { ActiveTab } from '../types';
import { Home, Users, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  peopleCount: number;
}

export function Navigation({ activeTab, onSelectTab, peopleCount }: NavigationProps) {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'الرئيسية',
      icon: Home,
    },
    {
      id: 'people' as ActiveTab,
      label: 'الأشخاص',
      icon: Users,
      badge: peopleCount > 0 ? peopleCount : undefined,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'الإعدادات',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 focus:outline-hidden ${
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-2xl transition-all ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-950/60' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-white dark:border-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 leading-none">
                {tab.label}
              </span>

              {/* Active Tab Indicator Bar */}
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
