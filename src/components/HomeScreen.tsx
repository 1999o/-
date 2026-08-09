import { useState, useMemo } from 'react';
import { Person } from '../types';
import { PersonCard } from './PersonCard';
import { sortPeopleByUpcoming, getDaysRemaining } from '../utils/dateUtils';
import { Search, Plus, Sparkles, UserPlus, CalendarHeart } from 'lucide-react';

interface HomeScreenProps {
  people: Person[];
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePersonRequest: (person: Person) => void;
  onViewPersonDetails: (person: Person) => void;
}

export function HomeScreen({
  people,
  onAddPerson,
  onEditPerson,
  onDeletePersonRequest,
  onViewPersonDetails,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sorted chronologically by days remaining
  const sortedPeople = useMemo(() => {
    return sortPeopleByUpcoming(people);
  }, [people]);

  // Filtered by search query
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return sortedPeople;
    const query = searchQuery.trim().toLowerCase();
    return sortedPeople.filter(p =>
      p.name.toLowerCase().includes(query) || (p.notes && p.notes.toLowerCase().includes(query))
    );
  }, [sortedPeople, searchQuery]);

  // Reminders happening today
  const todayRemindersCount = useMemo(() => {
    const today = new Date();
    return people.filter(p => getDaysRemaining(p.annualDate, today) === 0).length;
  }, [people]);

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث باسم الشخص..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-10 pl-4 py-3 text-sm text-slate-800 dark:text-slate-100 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
      </div>

      {/* Summary Stat Card */}
      {people.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-4 shadow-md flex items-center justify-between border border-emerald-600/30">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-200">
              <CalendarHeart className="w-4 h-4 text-amber-300" />
              <span>التذكيرات القادمة</span>
            </div>
            <p className="text-sm font-semibold text-emerald-50">
              {todayRemindersCount > 0 ? (
                <span className="text-amber-300 font-extrabold">
                  🌟 لديك {todayRemindersCount} تذكير اليوم!
                </span>
              ) : (
                'تابع مواعيد الأحبة والتواصل معهم بأطيب الكلمات'
              )}
            </p>
          </div>
          <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-xs px-3 py-2 rounded-2xl text-center border border-white/20 shrink-0">
            <span className="block text-xl font-black font-mono leading-none text-amber-300">
              {people.length}
            </span>
            <span className="text-[10px] text-emerald-100/80 font-medium">شخص مسجل</span>
          </div>
        </div>
      )}

      {/* Reminders List Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>التذكيرات السنوية القادمة</span>
          </h2>
          {sortedPeople.length > 0 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              مرتبة حسب الأقرب زمنياً
            </span>
          )}
        </div>

        {/* Empty State */}
        {filteredPeople.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-8 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 my-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-900/50 shadow-inner">
              <UserPlus className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد تذكيرات بعد'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? `لا توجد نتائج تطابق "${searchQuery}"`
                  : 'أضف الأشخاص المهمين لديك ليتذكرك التطبيق بالتواصل معهم وإرسال الدعوات الطيبة لهم.'}
              </p>
            </div>

            <button
              onClick={onAddPerson}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة شخص</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onEdit={onEditPerson}
                onDeleteRequest={onDeletePersonRequest}
                onViewDetails={onViewPersonDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Person Button */}
      <button
        onClick={onAddPerson}
        aria-label="إضافة شخص"
        className="fixed bottom-20 left-5 z-20 bg-gradient-to-tr from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-all flex items-center justify-center border-2 border-white dark:border-slate-800 group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
