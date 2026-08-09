import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { X, Save, User, Calendar, Phone, Clock, FileText, Camera, Bell } from 'lucide-react';

interface AddEditPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personData: Omit<Person, 'id' | 'createdAt'> & { id?: string }) => void;
  personToEdit?: Person | null;
  defaultTime?: string;
}

const PRESET_AVATARS = [
  '👴', '👵', '👨', '👩', '🧔', '🧕', '👶', '👦', '👧', '🧑‍💼', '❤️', '🌿'
];

export function AddEditPersonModal({
  isOpen,
  onClose,
  onSave,
  personToEdit,
  defaultTime = '09:00',
}: AddEditPersonModalProps) {
  const [name, setName] = useState('');
  const [annualDate, setAnnualDate] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderTime, setReminderTime] = useState(defaultTime);
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number>(0);

  const [errors, setErrors] = useState<{ name?: string; annualDate?: string }>({});

  useEffect(() => {
    if (personToEdit) {
      setName(personToEdit.name || '');
      setAnnualDate(personToEdit.annualDate || '');
      setPhone(personToEdit.phone || '');
      setImage(personToEdit.image || '');
      setNotes(personToEdit.notes || '');
      setReminderTime(personToEdit.reminderTime || defaultTime);
      setReminderDaysBefore(personToEdit.reminderDaysBefore ?? 0);
    } else {
      // Default reset
      setName('');
      // Default to today's date in YYYY-MM-DD
      const now = new Date();
      const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = now.getDate().toString().padStart(2, '0');
      setAnnualDate(`${now.getFullYear()}-${monthStr}-${dayStr}`);
      setPhone('');
      setImage('');
      setNotes('');
      setReminderTime(defaultTime);
      setReminderDaysBefore(0);
    }
    setErrors({});
  }, [personToEdit, isOpen, defaultTime]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { name?: string; annualDate?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'يرجى إدخال الاسم الكامل.';
    }
    if (!annualDate) {
      newErrors.annualDate = 'يرجى تحديد التاريخ السنوي.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: personToEdit?.id,
      name: name.trim(),
      annualDate,
      phone: phone.trim(),
      image,
      notes: notes.trim(),
      reminderTime,
      reminderDaysBefore,
    });

    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-emerald-800 dark:bg-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-300" />
            <h2 className="text-lg font-bold">
              {personToEdit ? 'تعديل بيانات الشخص' : 'إضافة شخص جديد'}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full hover:bg-emerald-700 dark:hover:bg-slate-700 text-emerald-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Avatar / Profile Image Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الصورة الشخصية (اختياري)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {image ? (
                  <img
                    src={image}
                    alt="معاينة"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl font-bold border-2 border-dashed border-emerald-300 dark:border-emerald-800">
                    {name ? name.trim().charAt(0) : '👤'}
                  </div>
                )}
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full text-[10px]"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Upload or Preset Buttons */}
              <div className="space-y-2 flex-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>رفع صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Preset Avatar Emojis */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-xs">
                  {PRESET_AVATARS.slice(0, 6).map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage('')} // Clear custom image if preset selected
                      className="p-1 text-lg rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 1. Full Name (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: الوالد العزيز، أخوك محمد..."
                className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-[11px] font-medium mt-1">{errors.name}</p>
            )}
          </div>

          {/* 2. Annual Date (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              التاريخ السنوي <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={annualDate}
                onChange={(e) => setAnnualDate(e.target.value)}
                className={`w-full bg-slate-50 dark:bg-slate-800/90 border rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 ${
                  errors.annualDate
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:ring-emerald-500/20 focus:border-emerald-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              يتكرر التذكير تلقائياً في نفس اليوم والشهر من كل عام.
            </p>
            {errors.annualDate && (
              <p className="text-red-500 text-[11px] font-medium mt-1">{errors.annualDate}</p>
            )}
          </div>

          {/* 3. Phone Number (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم الهاتف (اختياري للواتساب والاتصال)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 966501234567+"
                dir="ltr"
                className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-slate-100 text-right focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 4. Reminder Timing Options */}
          <div className="bg-emerald-50/50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-emerald-200/60 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>إعدادات التذكير</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Reminder Time */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  وقت التذكير:
                </label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Reminder Frequency / Days Before */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  موعد التنبيه:
                </label>
                <select
                  value={reminderDaysBefore}
                  onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-2 py-1.5 text-xs text-slate-800 dark:text-slate-100"
                >
                  <option value={0}>في نفس اليوم</option>
                  <option value={1}>قبل يوم واحد</option>
                  <option value={3}>قبل 3 أيام</option>
                  <option value={7}>قبل 7 أيام</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات أو أدعية (اختياري)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب ملاحظة أو ما تحب أن تتذكره عند التواصل..."
              className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>حفظ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
