package com.tathkeer.app.ui.components

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.data.model.Person

@Composable
fun DeleteConfirmationDialog(
    person: Person?,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    if (person == null) return

    AlertDialog(
        onDismissRequest = onDismiss,
        shape = RoundedCornerShape(20.dp),
        title = {
            Text(
                text = "تأكيد حذف التذكير",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Text(
                text = "هل أنت تأكد من إزالة \"${person.name}\" من قائمة التذكيرات؟ لا يمكن التراجع عن هذا الإجراء.",
                fontSize = 13.sp
            )
        },
        confirmButton = {
            Button(
                onClick = onConfirm,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(text = "حذف نهائياً")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = "إلغاء")
            }
        }
    )
}
