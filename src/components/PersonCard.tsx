import React from 'react';
import { Person } from '../types';
import { formatAnnualDateArabic, getDaysRemaining, formatDaysRemainingText } from '../utils/dateUtils';
import { openWhatsApp, makePhoneCall } from '../utils/contactUtils';
import { Phone, MessageCircle, Edit2, Trash2, Calendar, Clock, StickyNote } from 'lucide-react';

interface PersonCardProps {
  key?: string;
  person: Person;
  onEdit: (person: Person) => void;
  onDeleteRequest: (person: Person) => void;
  onViewDetails?: (person: Person) => void;
}

export function PersonCard({ person, onEdit, onDeleteRequest, onViewDetails }: PersonCardProps) {
  const daysRemaining = getDaysRemaining(person.annualDate);
  const formattedDate = formatAnnualDateArabic(person.annualDate);
  const daysText = formatDaysRemainingText(daysRemaining);

  const isToday = daysRemaining === 0;
  const isSoon = daysRemaining > 0 && daysRemaining <= 7;

  // Generate initial letter for fallback avatar
  const initial = person.name.trim().charAt(0) || '👤';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (person.phone) {
      openWhatsApp(person.phone, person.name);
    } else {
      alert('لا يوجد رقم هاتف مسجل لهذا الشخص. يمكنك تعديل بياناته وإضافة الرقم.');
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (person.phone) {
      makePhoneCall(person.phone);
    } else {
      alert('لا يوجد رقم هاتف مسجل لهذا الشخص. يمكنك تعديل بياناته وإضافة الرقم.');
    }
  };

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(person)}
      className={`group relative rounded-3xl p-4 transition-all duration-300 border shadow-sm hover:shadow-md cursor-pointer ${
        isToday
          ? 'bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:to-slate-900 border-amber-400/60 dark:border-amber-500/50 ring-2 ring-amber-400/20'
          : isSoon
          ? 'bg-emerald-50/70 dark:bg-slate-900/90 border-emerald-300/80 dark:border-emerald-800/60'
          : 'bg-white dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Profile Avatar / Image */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-xs"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white font-bold text-xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-xs">
                {initial}
              </div>
            )}
            {isToday && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full animate-ping" />
            )}
          </div>

          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {person.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {formattedDate}
              </span>
              {person.reminderTime && (
                <span className="flex items-center gap-1 text-[11px] font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {person.reminderTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Days Remaining Badge */}
        <div className="shrink-0 text-left">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-2xl text-xs font-black tracking-wide shadow-2xs ${
              isToday
                ? 'bg-amber-500 text-amber-950 dark:bg-amber-400 dark:text-slate-950 font-extrabold animate-pulse'
                : isSoon
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 font-extrabold'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {daysText}
          </span>
        </div>
      </div>

      {/* Notes snippet if present */}
      {person.notes && (
        <div className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-emerald-950/5 dark:bg-slate-800/50 p-2.5 rounded-xl flex items-start gap-1.5 line-clamp-2 border border-slate-200/50 dark:border-slate-800">
          <StickyNote className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>{person.notes}</span>
        </div>
      )}

      {/* Quick Action Buttons Bar */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* WhatsApp Action */}
          <button
            onClick={handleWhatsApp}
            title={person.phone ? 'تواصل عبر واتساب' : 'لا يوجد رقم هاتف'}
            disabled={!person.phone}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              person.phone
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>واتساب</span>
          </button>

          {/* Phone Call Action */}
          <button
            onClick={handleCall}
            title={person.phone ? 'اتصال تلفوني' : 'لا يوجد رقم هاتف'}
            disabled={!person.phone}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              person.phone
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>اتصال</span>
          </button>
        </div>

        {/* Edit and Delete Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(person);
            }}
            title="تعديل البيانات"
            className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRequest(person);
            }}
            title="حذف الشخص"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
