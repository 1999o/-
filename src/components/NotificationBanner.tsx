import { ActiveReminder } from '../utils/notificationUtils';
import { openWhatsApp, makePhoneCall } from '../utils/contactUtils';
import { BellRing, MessageCircle, Phone, X, Heart } from 'lucide-react';

interface NotificationBannerProps {
  reminders: ActiveReminder[];
  onDismiss: () => void;
}

export function NotificationBanner({ reminders, onDismiss }: NotificationBannerProps) {
  if (!reminders || reminders.length === 0) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-40 max-w-md mx-auto animate-bounceIn">
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-xl border border-emerald-500/40 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold animate-pulse shadow-xs">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-1">
                <span>تذكير صلة ومحبة اليوم</span>
                <Heart className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              </h4>
              <p className="text-[11px] text-emerald-100/90 font-medium">
                لديك {reminders.length} تذكيرات تتطلب الاهتمام والتواصل
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-600/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reminder Cards list */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {reminders.map((rem, idx) => (
            <div
              key={idx}
              className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xs rounded-xl p-2.5 border border-white/15 space-y-2"
            >
              <p className="text-xs font-semibold text-emerald-50 leading-relaxed">
                {rem.message}
              </p>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                <span className="font-bold text-amber-200">
                  {rem.person.name}
                </span>

                <div className="flex items-center gap-1.5">
                  {rem.person.phone && (
                    <>
                      <button
                        onClick={() => openWhatsApp(rem.person.phone!, rem.person.name)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>واتساب</span>
                      </button>
                      <button
                        onClick={() => makePhoneCall(rem.person.phone!)}
                        className="bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded-lg text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Phone className="w-3 h-3" />
                        <span>اتصال</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
