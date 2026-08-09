package com.tathkeer.app.utils

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import com.tathkeer.app.data.model.Person
import com.tathkeer.app.receiver.ReminderReceiver
import java.util.Calendar

object NotificationScheduler {

    fun schedulePersonReminder(context: Context, person: Person) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        val nextOccurrence = DateUtils.getNextOccurrence(person.annualDate)
        // Subtract reminderDaysBefore
        nextOccurrence.add(Calendar.DAY_OF_MONTH, -person.reminderDaysBefore)

        // Parse reminderTime 'HH:MM'
        val timeParts = person.reminderTime.split(":").mapNotNull { it.toIntOrNull() }
        val hour = timeParts.getOrNull(0) ?: 9
        val minute = timeParts.getOrNull(1) ?: 0

        nextOccurrence.set(Calendar.HOUR_OF_DAY, hour)
        nextOccurrence.set(Calendar.MINUTE, minute)
        nextOccurrence.set(Calendar.SECOND, 0)

        if (nextOccurrence.before(Calendar.getInstance())) {
            // Add a year if past
            nextOccurrence.add(Calendar.YEAR, 1)
        }

        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = "com.tathkeer.app.ACTION_REMINDER_NOTIFICATION"
            putExtra("PERSON_NAME", person.name)
            putExtra("MESSAGE", ContactUtils.getRandomWarmMessage(person.name))
        }

        val pendingIntent = PendingIntent.getBroadcast(
            context,
            person.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    nextOccurrence.timeInMillis,
                    pendingIntent
                )
            } else {
                alarmManager.set(
                    AlarmManager.RTC_WAKEUP,
                    nextOccurrence.timeInMillis,
                    pendingIntent
                )
            }
        } catch (_: SecurityException) {
            // Ignore if exact alarm permission not granted
        }
    }

    fun cancelPersonReminder(context: Context, personId: String) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = "com.tathkeer.app.ACTION_REMINDER_NOTIFICATION"
        }
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            personId.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        alarmManager.cancel(pendingIntent)
    }

    fun scheduleAll(context: Context, people: List<Person>) {
        people.forEach { person ->
            schedulePersonReminder(context, person)
        }
    }
}
