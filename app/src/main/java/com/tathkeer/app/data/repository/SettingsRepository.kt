package com.tathkeer.app.data.repository

import android.content.Context
import com.tathkeer.app.data.model.AppSettings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SettingsRepository(context: Context) {
    private val prefs = context.getSharedPreferences("tathkeer_settings", Context.MODE_PRIVATE)

    private val _settings = MutableStateFlow(loadSettings())
    val settingsFlow: StateFlow<AppSettings> = _settings.asStateFlow()

    fun getSettings(): AppSettings = loadSettings()

    private fun loadSettings(): AppSettings {
        return AppSettings(
            notificationsEnabled = prefs.getBoolean("notificationsEnabled", true),
            defaultReminderTime = prefs.getString("defaultReminderTime", "09:00") ?: "09:00",
            theme = prefs.getString("theme", "light") ?: "light",
            language = prefs.getString("language", "ar") ?: "ar"
        )
    }

    fun updateSettings(newSettings: AppSettings) {
        prefs.edit().apply {
            putBoolean("notificationsEnabled", newSettings.notificationsEnabled)
            putString("defaultReminderTime", newSettings.defaultReminderTime)
            putString("theme", newSettings.theme)
            putString("language", newSettings.language)
            apply()
        }
        _settings.value = newSettings
    }
}
