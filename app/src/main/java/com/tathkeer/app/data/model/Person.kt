package com.tathkeer.app.data.model

import java.util.UUID

data class Person(
    val id: String = UUID.randomUUID().toString(),
    val name: String,
    val annualDate: String, // 'YYYY-MM-DD' or 'MM-DD'
    val phone: String? = null,
    val image: String? = null,
    val notes: String? = null,
    val reminderTime: String = "09:00", // 'HH:MM'
    val reminderDaysBefore: Int = 0, // 0, 1, 3, 7
    val createdAt: String = System.currentTimeMillis().toString()
)

val WARM_NOTIFICATION_MESSAGES = listOf(
    "🌿 تذكير: لعل كلمة طيبة أو دعوة صادقة تُسعد قلب {NAME} في هذا اليوم.",
    "🤲 لا تنسَ الدعاء لـ {NAME}.",
    "🌸 الكلمة الطيبة صدقة، وهذا يوم مناسب للتواصل مع {NAME}.",
    "💚 صلة الرحم والمحبة تبدأ برسالة أو اتصال.",
    "🤍 قد تكون رسالتك اليوم سببًا في سرور قلب {NAME}.",
    "✨ تذكر أن تسأل عن {NAME} وتطمئن عليه اليوم.",
    "🌙 يوم جديد وفرصة طيبة للتواصل والدعاء لـ {NAME}."
)
