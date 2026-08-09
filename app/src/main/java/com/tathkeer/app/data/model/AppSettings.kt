package com.tathkeer.app.data.model

data class AppSettings(
    val notificationsEnabled: Boolean = true,
    val defaultReminderTime: String = "09:00",
    val theme: String = "light", // 'light', 'dark', 'system'
    val language: String = "ar"
)
