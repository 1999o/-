import { Person } from '../types';
import { formatAnnualDateArabic, getDaysRemaining, formatDaysRemainingText } from '../utils/dateUtils';
import { openWhatsApp, makePhoneCall } from '../utils/contactUtils';
import { X, Calendar, Phone, MessageCircle, Edit2, Trash2, Clock, StickyNote, Bell } from 'lucide-react';

interface PersonDetailsModalProps {
  person: Person | null;
  onClose: () => void;
  onEdit: (person: Person) => void;
  onDeleteRequest: (person: Person) => void;
}

export function PersonDetailsModal({
  person,
  onClose,
  onEdit,
  onDeleteRequest,
}: PersonDetailsModalProps) {
  if (!person) return null;

  const daysRemaining = getDaysRemaining(person.annualDate);
  const formattedDate = formatAnnualDateArabic(person.annualDate);
  const daysText = formatDaysRemainingText(daysRemaining);
  const isToday = daysRemaining === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Bell className="w-4 h-4" />
            <span>تفاصيل التذكير السنوي</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Person Hero */}
        <div className="text-center space-y-2">
          <div className="relative inline-block">
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="w-20 h-20 rounded-3xl object-cover mx-auto border-4 border-emerald-100 dark:border-slate-800 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-extrabold text-3xl flex items-center justify-center mx-auto border-4 border-emerald-100 dark:border-slate-800 shadow-md">
                {person.name.trim().charAt(0) || '👤'}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs ${
                isToday ? 'bg-amber-400 text-amber-950' : 'bg-emerald-600 text-white'
              }`}
            >
              {daysText}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
              {person.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formattedDate}</span>
              {person.reminderTime && (
                <>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{person.reminderTime}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 space-y-2.5 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          {person.phone && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">رقم الهاتف:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-200" dir="ltr">
                {person.phone}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">تنبيه مسبق:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {person.reminderDaysBefore === 0
                ? 'في نفس اليوم'
                : `قبل ${person.reminderDaysBefore} أيام`}
            </span>
          </div>

          {person.notes && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <StickyNote className="w-3.5 h-3.5 text-emerald-600" />
                <span>ملاحظات:</span>
              </span>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-slate-900 p-2 rounded-xl">
                {person.notes}
              </p>
            </div>
          )}
        </div>

        {/* Communication Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => person.phone && openWhatsApp(person.phone, person.name)}
            disabled={!person.phone}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all ${
              person.phone
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>مراسلة واتساب</span>
          </button>

          <button
            onClick={() => person.phone && makePhoneCall(person.phone)}
            disabled={!person.phone}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              person.phone
                ? 'bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-200'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>اتصال تلفوني</span>
          </button>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              onClose();
              onEdit(person);
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>تعديل</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onDeleteRequest(person);
            }}
            className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-bold p-2 rounded-xl text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
