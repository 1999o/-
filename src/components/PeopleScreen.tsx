import { useState, useMemo } from 'react';
import { Person } from '../types';
import { PersonCard } from './PersonCard';
import { getDaysRemaining, parseMonthAndDay } from '../utils/dateUtils';
import { Search, Users, Plus, Filter } from 'lucide-react';

interface PeopleScreenProps {
  people: Person[];
  onAddPerson: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePersonRequest: (person: Person) => void;
  onViewPersonDetails: (person: Person) => void;
}

type FilterOption = 'all' | 'today' | 'this_month' | 'upcoming';

export function PeopleScreen({
  people,
  onAddPerson,
  onEditPerson,
  onDeletePersonRequest,
  onViewPersonDetails,
}: PeopleScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const filteredPeople = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();

    return people.filter((p) => {
      // 1. Search filter
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (p.notes && p.notes.toLowerCase().includes(searchQuery.trim().toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Chip Filter
      const days = getDaysRemaining(p.annualDate, today);
      const { month } = parseMonthAndDay(p.annualDate);

      if (activeFilter === 'today') return days === 0;
      if (activeFilter === 'this_month') return month === currentMonth;
      if (activeFilter === 'upcoming') return days > 0 && days <= 30;

      return true;
    });
  }, [people, searchQuery, activeFilter]);

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header & Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
                سجل الأشخاص والتذكيرات
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إجمالي الأشخاص المسجلين: {people.length}
              </p>
            </div>
          </div>

          <button
            onClick={onAddPerson}
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة شخص</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الملاحظات..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
          </span>

          {[
            { id: 'all' as FilterOption, label: 'الجميع' },
            { id: 'today' as FilterOption, label: 'تذكيرات اليوم' },
            { id: 'this_month' as FilterOption, label: 'هذا الشهر' },
            { id: 'upcoming' as FilterOption, label: 'خلال 30 يوماً' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                activeFilter === chip.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* People List */}
      {filteredPeople.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/80 rounded-3xl p-8 text-center border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 my-6">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
            لا توجد نتائج تطابق معايير البحث والفلترة الحالية.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="text-xs text-emerald-600 font-bold underline"
          >
            إعادة ضبط الفلاتر
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

      {/* Floating Add Person Button */}
      <button
        onClick={onAddPerson}
        aria-label="إضافة شخص"
        className="fixed bottom-20 left-5 z-20 bg-gradient-to-tr from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-all flex items-center justify-center border-2 border-white dark:border-slate-800"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
