package com.tathkeer.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.ui.theme.Emerald500
import com.tathkeer.app.ui.theme.Emerald800
import com.tathkeer.app.ui.theme.Emerald900
import com.tathkeer.app.ui.theme.White

@Composable
fun Header(
    theme: String,
    onToggleTheme: () -> Unit,
    activeRemindersCount: Int,
    onOpenNotifications: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = Emerald900,
        shadowElevation = 4.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // App Title & Tagline
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Emerald500, Emerald800)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "🤲",
                        fontSize = 20.sp
                    )
                }

                Column {
                    Text(
                        text = "تذكير",
                        color = White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                    Text(
                        text = "صلة وتواصل بالمناسبات السنوية",
                        color = White.copy(alpha = 0.8f),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Top Actions: Theme toggle & Notifications badge
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Notifications icon button
                Box {
                    IconButton(onClick = onOpenNotifications) {
                        Icon(
                            imageVector = Icons.Default.Notifications,
                            contentDescription = "التذكيرات النشطة",
                            tint = White
                        )
                    }
                    if (activeRemindersCount > 0) {
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(top = 4.dp, end = 4.dp)
                                .size(18.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFEF4444)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = activeRemindersCount.toString(),
                                color = White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                // Theme toggle button
                IconButton(onClick = onToggleTheme) {
                    Icon(
                        imageVector = if (theme == "dark") Icons.Default.LightMode else Icons.Default.DarkMode,
                        contentDescription = "تبديل المظهر",
                        tint = White
                    )
                }
            }
        }
    }
}
