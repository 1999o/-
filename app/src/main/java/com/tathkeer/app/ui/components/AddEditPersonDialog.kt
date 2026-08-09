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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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

@Composable
fun AddEditPersonDialog(
    personToEdit: Person?,
    onDismiss: () -> Unit,
    onSave: (Person) -> Unit
) {
    var name by remember { mutableStateOf(personToEdit?.name ?: "") }
    var annualDate by remember { mutableStateOf(personToEdit?.annualDate ?: "2000-01-01") }
    var phone by remember { mutableStateOf(personToEdit?.phone ?: "") }
    var notes by remember { mutableStateOf(personToEdit?.notes ?: "") }
    var reminderTime by remember { mutableStateOf(personToEdit?.reminderTime ?: "09:00") }
    var reminderDaysBefore by remember { mutableStateOf(personToEdit?.reminderDaysBefore ?: 0) }

    var nameError by remember { mutableStateOf(false) }

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
                Text(
                    text = if (personToEdit == null) "إضافة شخص جديد للتذكيرات 🌸" else "تعديل بيانات الشخص ✏️",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.ExtraBold,
                    color = Emerald700
                )

                // Name field
                Column {
                    Text(text = "الاسم الكامل *", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = name,
                        onValueChange = {
                            name = it
                            nameError = false
                        },
                        placeholder = { Text("مثال: والدتي العزيزة، أبو أحمد") },
                        isError = nameError,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )
                    if (nameError) {
                        Text(text = "الاسم مطلوب", color = Color.Red, fontSize = 10.sp)
                    }
                }

                // Annual Date field
                Column {
                    Text(text = "التاريخ السنوي للمناسبة (YYYY-MM-DD)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = annualDate,
                        onValueChange = { annualDate = it },
                        placeholder = { Text("YYYY-MM-DD") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )
                }

                // Phone field
                Column {
                    Text(text = "رقم الهاتف (للتواصل السريع والواتساب)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        placeholder = { Text("مثال: 0501234567") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )
                }

                // Reminder Time
                Column {
                    Text(text = "وقت الإشعار والتذكير اليومي (HH:MM)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = reminderTime,
                        onValueChange = { reminderTime = it },
                        placeholder = { Text("09:00") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )
                }

                // Reminder Days Before selector
                Column {
                    Text(text = "التذكير المسبق قبل المناسبة:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        listOf(0 to "نفس اليوم", 1 to "قبل يوم", 3 to "قبل 3 أيام", 7 to "قبل أسبوع").forEach { (days, label) ->
                            val selected = reminderDaysBefore == days
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(if (selected) Emerald600 else MaterialTheme.colorScheme.background)
                                    .clickable { reminderDaysBefore = days }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = label,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (selected) White else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }

                // Notes field
                Column {
                    Text(text = "ملاحظات وتودد (اختياري)", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        placeholder = { Text("مثال: يفضل الاتصال صباحاً، تقديم هدية...") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        maxLines = 3,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )
                }

                // Actions
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = onDismiss) {
                        Text(text = "إلغاء")
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (name.isBlank()) {
                                nameError = true
                            } else {
                                onSave(
                                    Person(
                                        id = personToEdit?.id ?: java.util.UUID.randomUUID().toString(),
                                        name = name.trim(),
                                        annualDate = annualDate.trim(),
                                        phone = phone.trim().ifBlank { null },
                                        notes = notes.trim().ifBlank { null },
                                        reminderTime = reminderTime.trim().ifBlank { "09:00" },
                                        reminderDaysBefore = reminderDaysBefore,
                                        createdAt = personToEdit?.createdAt ?: System.currentTimeMillis().toString()
                                    )
                                )
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(text = if (personToEdit == null) "إضافة الشخص" else "حفظ التعديلات")
                    }
                }
            }
        }
    }
}
