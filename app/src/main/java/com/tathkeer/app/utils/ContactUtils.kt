package com.tathkeer.app.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.tathkeer.app.data.model.WARM_NOTIFICATION_MESSAGES
import java.net.URLEncoder

object ContactUtils {

    fun cleanPhoneNumber(phone: String?): String {
        if (phone.isNull_or_blank()) return ""
        return phone.replace(Regex("[^0-9+]"), "")
    }

    fun openWhatsApp(context: Context, phone: String?, customText: String? = null) {
        val cleanPhone = cleanPhoneNumber(phone)
        val textParam = customText?.let { URLEncoder.encode(it, "UTF-8") } ?: ""
        val uriStr = if (cleanPhone.isNotEmpty()) {
            "https://wa.me/$cleanPhone?text=$textParam"
        } else {
            "https://wa.me/?text=$textParam"
        }
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(uriStr))
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
            context.startActivity(intent)
        } catch (_: Exception) {
            // Fallback to browser or toast
        }
    }

    fun makePhoneCall(context: Context, phone: String?) {
        val cleanPhone = cleanPhoneNumber(phone)
        if (cleanPhone.isNotEmpty()) {
            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$cleanPhone"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            try {
                context.startActivity(intent)
            } catch (_: Exception) {
            }
        }
    }

    fun getRandomWarmMessage(personName: String): String {
        val template = WARM_NOTIFICATION_MESSAGES.random()
        return template.replace("{NAME}", personName)
    }

    fun generateWhatsAppGreeting(personName: String): String {
        return "السلام عليكم ورحمة الله وبركاته 🌸\nعزيزي/عزيزتي $personName، أحببت أن أطمئن عليك في هذا اليوم الطيب، ونسأل الله أن يحفظك ويديم عليك الصحة والعافية وراحة البال! 🤲💚"
    }
}

private fun String?.isNull_or_blank(): Boolean = this == null || this.trim().isEmpty()
