import { useState, useEffect, useCallback } from 'react';
import { Person, AppSettings, ActiveTab } from './types';
import {
  initializeDatabase,
  getPeople,
  savePerson,
  deletePerson,
  getSettings,
  saveSettings,
} from './utils/db';
import { checkActiveReminders, ActiveReminder } from './utils/notificationUtils';

import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { PeopleScreen } from './components/PeopleScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { AddEditPersonModal } from './components/AddEditPersonModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { PersonDetailsModal } from './components/PersonDetailsModal';
import { NotificationBanner } from './components/NotificationBanner';

export default function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: true,
    defaultReminderTime: '09:00',
    theme: 'light',
    language: 'ar',
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [personToView, setPersonToView] = useState<Person | null>(null);

  // Active Today/Upcoming Reminders
  const [activeReminders, setActiveReminders] = useState<ActiveReminder[]>([]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Reload data from local database
  const reloadData = useCallback(() => {
    const loadedPeople = getPeople();
    const loadedSettings = getSettings();
    setPeople(loadedPeople);
    setSettings(loadedSettings);

    // Check for active reminders
    if (loadedSettings.notificationsEnabled) {
      const reminders = checkActiveReminders(loadedPeople);
      setActiveReminders(reminders);
    }
  }, []);

  // Initialize DB and load data on mount
  useEffect(() => {
    initializeDatabase();
    reloadData();
  }, [reloadData]);

  // Handle Theme switching on document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Handlers for Add/Edit
  const handleOpenAddModal = () => {
    setPersonToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEditModal = (person: Person) => {
    setPersonToEdit(person);
    setIsAddEditOpen(true);
  };

  const handleSavePerson = (personData: Omit<Person, 'id' | 'createdAt'> & { id?: string }) => {
    const isEdit = Boolean(personData.id);
    savePerson(personData);
    reloadData();
    showToast(isEdit ? 'تم تحديث بيانات الشخص بنجاح' : 'تم إضافة الشخص بنجاح إلى التذكيرات');
  };

  // Handlers for Delete
  const handleOpenDeleteModal = (person: Person) => {
    setPersonToDelete(person);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (personToDelete) {
      deletePerson(personToDelete.id);
      reloadData();
      setIsDeleteOpen(false);
      setPersonToDelete(null);
      showToast('تم حذف الشخص بنجاح');
    }
  };

  // Handlers for View Details
  const handleViewPersonDetails = (person: Person) => {
    setPersonToView(person);
    setIsDetailsOpen(true);
  };

  // Handlers for Settings
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
    showToast('تم حفظ الإعدادات');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-start items-center selection:bg-emerald-500/30">
      {/* Mobile Device Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-emerald-950/5 dark:bg-slate-950 relative flex flex-col shadow-2xl overflow-x-hidden border-x border-slate-200/60 dark:border-slate-800/60">
        
        {/* Android Status Bar */}
        <StatusBar />

        {/* Header App Bar */}
        <Header
          theme={settings.theme}
          onToggleTheme={() =>
            handleUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
          }
          activeRemindersCount={activeReminders.length}
          onOpenNotificationsModal={() => {
            if (activeReminders.length > 0) {
              showToast(`لديك ${activeReminders.length} تذكيرات نشطة اليوم!`);
            } else {
              showToast('لا توجد تذكيرات مستحقة في الوقت الحالي.');
            }
          }}
        />

        {/* Active Reminders Banner Notification */}
        <NotificationBanner
          reminders={activeReminders}
          onDismiss={() => setActiveReminders([])}
        />

        {/* Toast Feedback Message */}
        {toastMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 dark:bg-emerald-900/90 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-xl border border-emerald-500/30 animate-fadeIn text-center max-w-xs">
            ✨ {toastMsg}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeScreen
              people={people}
              onAddPerson={handleOpenAddModal}
              onEditPerson={handleOpenEditModal}
              onDeletePersonRequest={handleOpenDeleteModal}
              onViewPersonDetails={handleViewPersonDetails}
            />
          )}

          {activeTab === 'people' && (
            <PeopleScreen
              people={people}
              onAddPerson={handleOpenAddModal}
              onEditPerson={handleOpenEditModal}
              onDeletePersonRequest={handleOpenDeleteModal}
              onViewPersonDetails={handleViewPersonDetails}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onDataRestored={reloadData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          peopleCount={people.length}
        />

        {/* Modals */}
        <AddEditPersonModal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          onSave={handleSavePerson}
          personToEdit={personToEdit}
          defaultTime={settings.defaultReminderTime}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          personName={personToDelete?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteOpen(false);
            setPersonToDelete(null);
          }}
        />

        <PersonDetailsModal
          person={personToView}
          onClose={() => setPersonToView(null)}
          onEdit={(person) => {
            handleOpenEditModal(person);
          }}
          onDeleteRequest={(person) => {
            handleOpenDeleteModal(person);
          }}
        />
      </div>
    </div>
  );
}
