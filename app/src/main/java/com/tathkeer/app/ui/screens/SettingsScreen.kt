package com.tathkeer.app.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Android
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.ContentPaste
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.data.model.AppSettings
import com.tathkeer.app.ui.theme.Emerald500
import com.tathkeer.app.ui.theme.Emerald600
import com.tathkeer.app.ui.theme.Emerald700
import com.tathkeer.app.ui.theme.Emerald900
import com.tathkeer.app.ui.theme.White

@Composable
fun SettingsScreen(
    settings: AppSettings,
    onUpdateSettings: (AppSettings) -> Unit,
    onExportBackup: () -> String,
    onImportBackup: (String) -> Boolean,
    onResetData: () -> Unit,
    showToast: (String) -> Unit
) {
    val context = LocalContext.current
    var importJsonText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
            .verticalScroll(rememberScrollState()),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Spacer(modifier = Modifier.height(8.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(imageVector = Icons.Default.Settings, contentDescription = "الإعدادات", tint = Emerald700)
            Text(
                text = "إعدادات التطبيق وتثبيت أندرويد",
                fontSize = 17.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Emerald700
            )
        }

        // Native Android Standalone Info Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Emerald900)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(imageVector = Icons.Default.Android, contentDescription = "أندرويد أصلي", tint = Emerald500)
                    Text(
                        text = "تطبيق أندرويد أصلي (Android Native)",
                        color = White,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }

                Text(
                    text = "يعمل تطبيق \"تذكير\" كنسخة أندرويد أصلية مستقلة تم بناؤها بلغة Kotlin وJetpack Compose. تعمل الإشعارات المحلية تلقائياً وتُحفظ بياناتك محلياً بشكل آمن بدقة ودون الحاجة لاتصال بالإنترنت.",
                    color = White.copy(alpha = 0.85f),
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
            }
        }

        // Notifications Settings Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Notifications, contentDescription = "الإشعارات", tint = Emerald600)
                        Column {
                            Text(text = "التذكيرات والإشعارات المحلية", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text(text = "تفعيل إشعارات الهاتف للتذكير بالمناسبات", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                    }

                    Switch(
                        checked = settings.notificationsEnabled,
                        onCheckedChange = {
                            onUpdateSettings(settings.copy(notificationsEnabled = it))
                        },
                        colors = SwitchDefaults.colors(checkedThumbColor = Emerald600)
                    )
                }
            }
        }

        // Theme Settings Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = if (settings.theme == "dark") Icons.Default.DarkMode else Icons.Default.LightMode,
                            contentDescription = "المظهر",
                            tint = Emerald600
                        )
                        Column {
                            Text(text = "مظهر التطبيق (الوضع الداكن)", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text(text = "التبديل بين المظهر الفاتح والداكن", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                    }

                    Switch(
                        checked = settings.theme == "dark",
                        onCheckedChange = { isDark ->
                            onUpdateSettings(settings.copy(theme = if (isDark) "dark" else "light"))
                        },
                        colors = SwitchDefaults.colors(checkedThumbColor = Emerald600)
                    )
                }
            }
        }

        // Backup & Restore Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "النسخ الاحتياطي والاستعادة 💾",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Emerald700
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            val json = onExportBackup()
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            val clip = ClipData.newPlainText("TathkeerBackup", json)
                            clipboard.setPrimaryClip(clip)
                            showToast("تم نسخ بياناتك الاحتياطية للحافظة!")
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(imageVector = Icons.Default.ContentCopy, contentDescription = "تصدير")
                        Text(text = "نسخ احتياطي", fontSize = 12.sp)
                    }
                }

                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    OutlinedTextField(
                        value = importJsonText,
                        onValueChange = { importJsonText = it },
                        placeholder = { Text("الصق النص الاحتياطي هنا للاستعادة...") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 3,
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedButton(
                        onClick = {
                            if (importJsonText.isNotBlank()) {
                                val success = onImportBackup(importJsonText)
                                if (success) {
                                    importJsonText = ""
                                } else {
                                    showToast("فشلت الاستعادة، تأكد من صحة النص")
                                }
                            }
                        },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.ContentPaste, contentDescription = "استعادة")
                        Text(text = "استعادة البيانات من النص")
                    }
                }
            }
        }

        // Danger Reset Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "مسح البيانات",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFEF4444)
                )
                Text(
                    text = "حذف كافة التذكيرات والأسماء المسجلة بالتطبيق مع العودة إلى الإعدادات الأولية.",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )

                OutlinedButton(
                    onClick = onResetData,
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFEF4444)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.Refresh, contentDescription = "مسح")
                    Text(text = "مسح جميع البيانات")
                }
            }
        }

        Spacer(modifier = Modifier.height(80.dp))
    }
}
