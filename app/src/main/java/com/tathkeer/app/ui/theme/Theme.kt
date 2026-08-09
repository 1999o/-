package com.tathkeer.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = Emerald500,
    onPrimary = White,
    primaryContainer = Emerald900,
    onPrimaryContainer = White,
    secondary = Emerald600,
    background = Slate950,
    surface = Slate900,
    onBackground = Slate50,
    onSurface = Slate50
)

private val LightColorScheme = lightColorScheme(
    primary = Emerald700,
    onPrimary = White,
    primaryContainer = Emerald500,
    onPrimaryContainer = White,
    secondary = Emerald600,
    background = Slate100,
    surface = White,
    onBackground = Slate800,
    onSurface = Slate800
)

@Composable
fun TathkeerTheme(
    themeSetting: String = "light",
    content: @Composable () -> Unit
) {
    val darkTheme = when (themeSetting) {
        "dark" -> true
        "light" -> false
        else -> isSystemInDarkTheme()
    }

    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
