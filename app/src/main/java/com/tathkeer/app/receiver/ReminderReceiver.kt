package com.tathkeer.app.receiver

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import com.tathkeer.app.MainActivity
import com.tathkeer.app.R
import com.tathkeer.app.TathkeerApplication
import com.tathkeer.app.utils.ContactUtils

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val personName = intent.getStringExtra("PERSON_NAME") ?: "شخص عزيز"
        val customMessage = intent.getStringExtra("MESSAGE")
            ?: ContactUtils.getRandomWarmMessage(personName)

        val mainIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            personName.hashCode(),
            mainIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = NotificationCompat.Builder(context, TathkeerApplication.CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("تذكير بمناسبة: $personName 🌸")
            .setContentText(customMessage)
            .setStyle(NotificationCompat.BigTextStyle().bigText(customMessage))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)

        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(personName.hashCode(), builder.build())
    }
}
