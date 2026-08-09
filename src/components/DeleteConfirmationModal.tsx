import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  personName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  personName,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            هل أنت متأكد من حذف هذا الشخص؟
          </h3>
          {personName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              سيتم حذف <span className="font-bold text-slate-700 dark:text-slate-200">{personName}</span> وجميع تذكيراته.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            إلغاء
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف</span>
          </button>
        </div>
      </div>
    </div>
  );
}
