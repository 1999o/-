import React, { useState } from 'react';
import { AppSettings } from '../types';
import { requestNotificationPermission, sendBrowserNotification, getRandomWarmMessage } from '../utils/notificationUtils';
import { exportBackupData, importBackupData } from '../utils/db';
import {
  Bell,
  Clock,
  Moon,
  Sun,
  Globe,
  Download,
  Upload,
  Info,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Smartphone,
  Share2,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onDataRestored: () => void;
}

export function SettingsScreen({
  settings,
  onUpdateSettings,
  onDataRestored,
}: SettingsScreenProps) {
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTabPlatform, setActiveTabPlatform] = useState<'iphone' | 'android'>('iphone');

  const handleToggleNotifications = async () => {
    const nextVal = !settings.notificationsEnabled;
    if (nextVal) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        alert('يرجى السماح بالإشعارات من إعدادات المتصفح أو الجهاز ليصلك التنبيه في موعده.');
      }
    }
    onUpdateSettings({ notificationsEnabled: nextVal });
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    const sampleMessage = getRandomWarmMessage('الوالد العزيز');
    
    sendBrowserNotification('🌿 تذكير - تجربة الإشعار', sampleMessage);
    
    setBackupMsg({
      type: 'success',
      text: 'تم إرسال إشعار تجريبي بنجاح! تفقد شريط التنبيهات علو الشاشة.',
    });
    setTimeout(() => setBackupMsg(null), 4000);
  };

  const handleExportBackup = () => {
    try {
      const dataStr = exportBackupData();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `tathkeer_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupMsg({
        type: 'success',
        text: 'تم تصدير النسخة الاحتياطية بنجاح وحفظها في جهازك.',
      });
      setTimeout(() => setBackupMsg(null), 4000);
    } catch {
      setBackupMsg({
        type: 'error',
        text: 'حدث خطأ أثناء تصدير النسخة الاحتياطية.',
      });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonContent = event.target?.result as string;
      if (jsonContent) {
        const result = importBackupData(jsonContent);
        if (result.success) {
          setBackupMsg({
            type: 'success',
            text: `تم استعادة البيانات بنجاح! تم تحميل ${result.count} شخص.`,
          });
          onDataRestored();
        } else {
          setBackupMsg({
            type: 'error',
            text: result.error || 'فشل استعادة النسخة الاحتياطية.',
          });
        }
      }
    };
    reader.readAsText(file);
    setTimeout(() => setBackupMsg(null), 5000);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      // Fallback
      alert('الرابط: ' + currentUrl);
    });
  };

  const handleShareLink = async () => {
    const currentUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'تطبيق تذكير - Tathkeer',
          text: 'تطبيق تذكير بالمناسبات والصلات السنوية للأحبة',
          url: currentUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center gap-2.5 px-1">
        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
            إعدادات التطبيق
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تخصيص الإشعارات، المظهر، والنسخ الاحتياطي
          </p>
        </div>
      </div>

      {/* Message Toast */}
      {backupMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border shadow-xs animate-bounceIn ${
            backupMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800'
          }`}
        >
          {backupMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{backupMsg.text}</span>
        </div>
      )}

      {/* Section 1: Notifications Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell className="w-4 h-4" />
          <span>الإشعارات والتنبيهات</span>
        </h3>

        {/* Enable / Disable Toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              تفعيل التنبيهات السنوية
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              إرسال تذكير في الموعد المحدد للحرص على صلة الرحم والتواصل
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              settings.notificationsEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.notificationsEnabled ? 'translate-x-0' : '-translate-x-5'
              }`}
            />
          </button>
        </div>

        {/* Default Reminder Time */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              وقت التنبيه الافتراضي:
            </span>
          </div>

          <input
            type="time"
            value={settings.defaultReminderTime}
            onChange={(e) => onUpdateSettings({ defaultReminderTime: e.target.value })}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 font-mono"
          />
        </div>

        {/* Test Notification Button */}
        <button
          type="button"
          onClick={handleTestNotification}
          className="w-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-200/60 dark:border-emerald-800 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          <span>إرسال إشعار تجريبي الآن</span>
        </button>
      </div>

      {/* Section 2: Appearance & Language */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sun className="w-4 h-4" />
          <span>المظهر واللغة</span>
        </h3>

        {/* Light / Dark Mode Toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            {settings.theme === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-300" />
            ) : (
              <Sun className="w-4 h-4 text-emerald-600" />
            )}
            <span>وضع الرؤية (الداكن / الفاتح):</span>
          </span>

          <button
            type="button"
            onClick={() =>
              onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
            }
            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {settings.theme === 'dark' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>لغة التطبيق:</span>
          </span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg">
            العربية (كامل)
          </span>
        </div>
      </div>

      {/* Section 3: Install App on Mobile (PWA Instructions & Share) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-emerald-500/30 dark:border-emerald-800/50 shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
        
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>طريقة تنزيل وتثبيت التطبيق على الجوال</span>
          </h3>
          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            تطبيقات الويب PWA
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          يمكنك إضافة تطبيق <strong className="text-emerald-700 dark:text-emerald-400">تذكير</strong> مباشرة على شاشة جوالك ليعمل كتطبيق عادي وبشكل كامل وبدون الحاجة لمتجر التطبيقات!
        </p>

        {/* Action buttons: Copy & Share */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط التطبيق'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareLink}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>مشاركة لجوالك</span>
          </button>
        </div>

        {/* Platform Selection Tabs */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTabPlatform('iphone')}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTabPlatform === 'iphone'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>📱 آيفون (Safari)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTabPlatform('android')}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTabPlatform === 'android'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <span>🤖 أندرويد (Chrome)</span>
            </button>
          </div>

          {/* Steps for iPhone */}
          {activeTabPlatform === 'iphone' && (
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-xs border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">1</span>
                <p>افتح رابط التطبيق في متصفح <strong>سفاري (Safari)</strong> على جوالك الآيفون.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">2</span>
                <p>اضغط على زر <strong>المشاركة <Share2 className="w-3.5 h-3.5 inline text-emerald-600" /></strong> أسفل شاشة المتصفح.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">3</span>
                <p>اختر من القائمة: <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">4</span>
                <p>اضغط <strong>"إضافة" (Add)</strong> بالأعلى. ستظهر أيقونة "تذكير" فوراً بين تطبيقك!</p>
              </div>
            </div>
          )}

          {/* Steps for Android */}
          {activeTabPlatform === 'android' && (
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-xs border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">1</span>
                <p>افتح رابط التطبيق في متصفح <strong>جوجل كروم (Chrome)</strong> على جوالك الأندرويد.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">2</span>
                <p>اضغط على قائمة النقاط الثلاث <strong>(⋮)</strong> بأعلى يمين أو يسار الشاشة.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">3</span>
                <p>اختر <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.</p>
              </div>

              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] flex items-center justify-center shrink-0">4</span>
                <p>اضغط <strong>"تثبيت" (Install)</strong> لتجد أيقونة التطبيق جاهزة للاستخدام أوفلاين!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Backup & Restore */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
          <Download className="w-4 h-4" />
          <span>النسخ الاحتياطي والاستعادة</span>
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          حفظ جميع الأشخاص والملاحظات والتاريخ في ملف خارجي، أو استعادتها لاحقاً.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Export */}
          <button
            type="button"
            onClick={handleExportBackup}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة</span>
          </button>

          {/* Import */}
          <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>استعادة ملف</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Section 4: About Application */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg border border-emerald-700/50 space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/60 border border-emerald-400/40 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
          <HeartHandshake className="w-6 h-6" />
        </div>

        <div>
          <h4 className="text-xl font-black text-amber-300">تذكير</h4>
          <p className="text-xs font-medium text-emerald-200 mt-1 italic">
            "لعل كلمة طيبة أو دعوة صادقة تُسعد قلبًا."
          </p>
        </div>

        <p className="text-xs text-emerald-100/80 leading-relaxed max-w-xs mx-auto border-t border-emerald-700/50 pt-3">
          تطبيق شخصي مصمم خصيصاً لمساعدتك على تذكر التواريخ السنوية للأشخاص المهمين لديك، لتظل على تواصل دائم ومستمر بالاتصال والدعاء والكلمات الطيبة التي تشرح الصدر.
        </p>

        <div className="text-[11px] text-emerald-300/60 font-mono pt-1 flex items-center justify-center gap-1">
          <Info className="w-3 h-3" />
          <span>الإصدار 1.0.0 • يعمل أوفلاين بالكامل</span>
        </div>
      </div>
    </div>
  );
}
