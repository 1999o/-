export interface Person {
  id: string;
  name: string;
  annualDate: string; // ISO string 'YYYY-MM-DD' or 'MM-DD'
  phone?: string;
  image?: string;
  notes?: string;
  reminderTime: string; // 'HH:MM' (24h format, e.g., '09:00')
  reminderDaysBefore: number; // 0 = on the date, 1 = 1 day before, 3 = 3 days before, 7 = 7 days before
  createdAt: string;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  defaultReminderTime: string;
  theme: 'light' | 'dark' | 'system';
  language: 'ar';
}

export interface NotificationLog {
  id: string;
  personId: string;
  personName: string;
  message: string;
  scheduledDate: string;
  sentAt?: string;
}

export type ActiveTab = 'home' | 'people' | 'settings';

export const WARM_NOTIFICATION_MESSAGES = [
  "🌿 تذكير: لعل كلمة طيبة أو دعوة صادقة تُسعد قلب {NAME} في هذا اليوم.",
  "🤲 لا تنسَ الدعاء لـ {NAME}.",
  "🌸 الكلمة الطيبة صدقة، وهذا يوم مناسب للتواصل مع {NAME}.",
  "💚 صلة الرحم والمحبة تبدأ برسالة أو اتصال.",
  "🤍 قد تكون رسالتك اليوم سببًا في سرور قلب {NAME}.",
  "✨ تذكر أن تسأل عن {NAME} وتطمئن عليه اليوم.",
  "🌙 يوم جديد وفرصة طيبة للتواصل والدعاء لـ {NAME}."
];
