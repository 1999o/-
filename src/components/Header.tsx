import { Moon, Sun, Bell, HeartHandshake } from 'lucide-react';
import { getFormattedTodayArabic } from '../utils/dateUtils';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
  activeRemindersCount: number;
  onOpenNotificationsModal: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  activeRemindersCount,
  onOpenNotificationsModal,
}: HeaderProps) {
  const { gregorian, hijri, weekday } = getFormattedTodayArabic();

  return (
    <header className="sticky top-0 z-30 bg-emerald-800 dark:bg-slate-900 text-white shadow-md border-b border-emerald-700/50 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Name & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/80 dark:bg-emerald-700/60 border border-emerald-400/30 flex items-center justify-center shadow-inner text-white">
            <HeartHandshake className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              تذكير
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h1>
            <p className="text-[11px] text-emerald-200/90 font-medium mt-0.5">
              {weekday}، {gregorian}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Notification Bell Badge */}
          <button
            onClick={onOpenNotificationsModal}
            aria-label="التنبيهات"
            className="relative p-2.5 rounded-xl bg-emerald-700/60 dark:bg-slate-800 hover:bg-emerald-700 text-emerald-100 transition-colors focus:outline-hidden"
          >
            <Bell className="w-5 h-5" />
            {activeRemindersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-amber-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-800 dark:border-slate-900 animate-bounce shadow-xs">
                {activeRemindersCount}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="تغيير المظهر"
            className="p-2.5 rounded-xl bg-emerald-700/60 dark:bg-slate-800 hover:bg-emerald-700 text-emerald-100 transition-colors focus:outline-hidden"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-300" />
            ) : (
              <Moon className="w-5 h-5 text-emerald-200" />
            )}
          </button>
        </div>
      </div>

      {/* Hijri Date Sub-bar */}
      {hijri && (
        <div className="bg-emerald-900/60 dark:bg-slate-950/80 px-4 py-1 text-[11px] text-center text-emerald-200/80 font-medium border-t border-emerald-700/30">
          ✨ {hijri}
        </div>
      )}
    </header>
  );
}
