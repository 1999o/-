package com.tathkeer.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.tathkeer.app.data.model.Person
import com.tathkeer.app.ui.theme.Emerald500
import com.tathkeer.app.ui.theme.Emerald600
import com.tathkeer.app.ui.theme.Emerald700
import com.tathkeer.app.ui.theme.White
import com.tathkeer.app.utils.ContactUtils
import com.tathkeer.app.utils.DateUtils

@Composable
fun PersonDetailsDialog(
    person: Person?,
    onDismiss: () -> Unit,
    onWhatsApp: (String) -> Unit,
    onCall: () -> Unit
) {
    if (person == null) return

    val daysRemaining = DateUtils.getDaysRemaining(person.annualDate)
    val daysText = DateUtils.formatDaysRemainingText(daysRemaining)
    val arabicDate = DateUtils.formatAnnualDateArabic(person.annualDate)

    var customMessage by remember {
        mutableStateOf(ContactUtils.generateWhatsAppGreeting(person.name))
    }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(24.dp),
            color = MaterialTheme.colorScheme.surface,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Top title and close
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "تفاصيل الشخص والتواصل 🌸",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Emerald700
                    )
                    IconButton(onClick = onDismiss, modifier = Modifier.size(28.dp)) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "إغلاق")
                    }
                }

                // Main Info Card
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(Emerald500.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = person.name.take(1),
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Emerald700
                        )
                    }

                    Column {
                        Text(
                            text = person.name,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "تاريخ المناسبة: $arabicDate ($daysText)",
                            fontSize = 12.sp,
                            color = Emerald600,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                if (!person.notes.isNull_or_blank()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.background)
                            .padding(12.dp)
                    ) {
                        Text(
                            text = "📝 ملاحظات: ${person.notes}",
                            fontSize = 12.sp
                        )
                    }
                }

                // WhatsApp Greeting Generator Box
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Emerald500.copy(alpha = 0.08f))
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "💬 صيغة الرسالة للواتساب:",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald700
                        )

                        Text(
                            text = "تحديث الرسالة 🔄",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Emerald600,
                            modifier = Modifier.clickable {
                                customMessage = ContactUtils.generateWhatsAppGreeting(person.name)
                            }
                        )
                    }

                    OutlinedTextField(
                        value = customMessage,
                        onValueChange = { customMessage = it },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 4,
                        shape = RoundedCornerShape(12.dp)
                    )

                    Button(
                        onClick = { onWhatsApp(customMessage) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "إرسال الرسالة عبر الواتساب 💬",
                            fontWeight = FontWeight.Bold,
                            color = White
                        )
                    }
                }

                // Phone Call button
                if (!person.phone.isNull_or_blank()) {
                    Button(
                        onClick = onCall,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(imageVector = Icons.Default.Phone, contentDescription = "اتصال", tint = White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "إجراء اتصال هاتفي (${person.phone})", color = White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

private fun String?.isNull_or_blank(): Boolean = this == null || this.trim().isEmpty()
