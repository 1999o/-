import { Person, WARM_NOTIFICATION_MESSAGES } from '../types';
import { getDaysRemaining } from './dateUtils';

/**
 * Returns a warm notification message for a person without any mention of birthday/greeting
 */
export function getRandomWarmMessage(personName: string): string {
  const randomIndex = Math.floor(Math.random() * WARM_NOTIFICATION_MESSAGES.length);
  const template = WARM_NOTIFICATION_MESSAGES[randomIndex];
  return template.replace(/\{NAME\}/g, personName);
}

/**
 * Requests browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Web Notifications are not supported in this browser.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Dispatches a native browser notification if allowed
 */
export function sendBrowserNotification(title: string, body: string, iconUrl?: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: iconUrl || '/favicon.ico',
        dir: 'rtl',
        lang: 'ar',
      });
    } catch (err) {
      console.error('Error triggering notification:', err);
    }
  }
}

export interface ActiveReminder {
  person: Person;
  message: string;
  daysRemaining: number;
  triggerType: 'today' | 'upcoming';
}

/**
 * Checks all people for reminders matching today or configured days before
 */
export function checkActiveReminders(people: Person[]): ActiveReminder[] {
  const today = new Date();
  const activeReminders: ActiveReminder[] = [];

  for (const person of people) {
    const daysRemaining = getDaysRemaining(person.annualDate, today);
    const configuredDaysBefore = Number(person.reminderDaysBefore) || 0;

    // Trigger if days remaining matches configured days before or is 0 (on the day)
    if (daysRemaining === configuredDaysBefore) {
      const message = getRandomWarmMessage(person.name);
      activeReminders.push({
        person,
        message,
        daysRemaining,
        triggerType: daysRemaining === 0 ? 'today' : 'upcoming',
      });
    }
  }

  return activeReminders;
}
