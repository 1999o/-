import { Person, AppSettings, NotificationLog } from '../types';

const STORAGE_KEYS = {
  PEOPLE: 'tathkeer_people_v1',
  SETTINGS: 'tathkeer_settings_v1',
  NOTIFICATIONS: 'tathkeer_notifications_v1',
  INITIALIZED: 'tathkeer_init_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  notificationsEnabled: true,
  defaultReminderTime: '09:00',
  theme: 'light',
  language: 'ar',
};

// Initial Arabic sample records for first time users
const INITIAL_PEOPLE: Person[] = [
  {
    id: 'sample_1',
    name: 'الوالد العزيز (أبو أحمد)',
    annualDate: '1970-08-15', // Near future date or custom
    phone: '+966501234567',
    notes: 'الاتصال به والتعبير عن المحبة والامتنان، والدعاء له بدوام الصحة والعافية.',
    reminderTime: '09:00',
    reminderDaysBefore: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_2',
    name: 'الوالدة الحبيبة (أم أحمد)',
    annualDate: '1974-11-20',
    phone: '+966507654321',
    notes: 'إرسال باقة ورد مع كلمة طيبة وزيارتها.',
    reminderTime: '08:30',
    reminderDaysBefore: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample_3',
    name: 'الصديق الوفي (أبو خالد)',
    annualDate: '1992-02-14',
    phone: '+966551122334',
    notes: 'الاطمئنان عليه وتقديم التهاني والتمنيات الخالصة بالخير والبركة.',
    reminderTime: '10:00',
    reminderDaysBefore: 0,
    createdAt: new Date().toISOString(),
  }
];

export function initializeDatabase(): void {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(INITIAL_PEOPLE));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (err) {
    console.error('Error initializing Tathkeer database:', err);
  }
}

export function getPeople(): Person[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PEOPLE);
    if (!data) {
      initializeDatabase();
      const retryData = localStorage.getItem(STORAGE_KEYS.PEOPLE);
      return retryData ? JSON.parse(retryData) : [];
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to parse people database:', err);
    return [];
  }
}

export function savePerson(personData: Omit<Person, 'id' | 'createdAt'> & { id?: string }): Person {
  const people = getPeople();
  const now = new Date().toISOString();

  if (personData.id) {
    // Edit existing
    const index = people.findIndex(p => p.id === personData.id);
    if (index !== -1) {
      const updatedPerson: Person = {
        ...people[index],
        ...personData,
        id: personData.id,
      };
      people[index] = updatedPerson;
      localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
      return updatedPerson;
    }
  }

  // Create new
  const newPerson: Person = {
    id: 'person_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    name: personData.name,
    annualDate: personData.annualDate,
    phone: personData.phone || '',
    image: personData.image || '',
    notes: personData.notes || '',
    reminderTime: personData.reminderTime || '09:00',
    reminderDaysBefore: Number(personData.reminderDaysBefore) || 0,
    createdAt: now,
  };

  people.push(newPerson);
  localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(people));
  return newPerson;
}

export function deletePerson(id: string): boolean {
  try {
    const people = getPeople();
    const filtered = people.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete person:', err);
    return false;
  }
}

export function getSettings(): AppSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  return updated;
}

export interface BackupData {
  version: string;
  appName: string;
  exportedAt: string;
  people: Person[];
  settings: AppSettings;
}

export function exportBackupData(): string {
  const backup: BackupData = {
    version: '1.0.0',
    appName: 'تذكير',
    exportedAt: new Date().toISOString(),
    people: getPeople(),
    settings: getSettings(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString) as BackupData;
    if (!parsed || !Array.isArray(parsed.people)) {
      return { success: false, error: 'تنسيق ملف النسخ الاحتياطي غير صالح.' };
    }

    localStorage.setItem(STORAGE_KEYS.PEOPLE, JSON.stringify(parsed.people));
    if (parsed.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
    }
    return { success: true, count: parsed.people.length };
  } catch {
    return { success: false, error: 'حدث خطأ أثناء قراءة ملف النسخ الاحتياطي.' };
  }
}
