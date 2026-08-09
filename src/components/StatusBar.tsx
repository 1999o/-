import { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export function StatusBar() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-emerald-900/90 dark:bg-slate-900 text-emerald-100 text-xs px-4 py-1.5 flex items-center justify-between select-none font-sans font-medium tracking-wide shadow-xs border-b border-emerald-800/20">
      <div className="flex items-center gap-1.5 dir-ltr">
        <Wifi className="w-3.5 h-3.5" />
        <Signal className="w-3.5 h-3.5" />
        <BatteryMedium className="w-4 h-4" />
      </div>
      <div className="font-semibold text-[11px] font-mono">
        {timeStr || '10:22'}
      </div>
    </div>
  );
}
