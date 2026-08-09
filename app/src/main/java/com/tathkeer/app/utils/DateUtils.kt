package com.tathkeer.app.utils

import com.tathkeer.app.data.model.Person
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

object DateUtils {

    val ARABIC_MONTHS = listOf(
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    )

    val ARABIC_WEEKDAYS = mapOf(
        Calendar.SUNDAY to "الأحد",
        Calendar.MONDAY to "الإثنين",
        Calendar.TUESDAY to "الثلاثاء",
        Calendar.WEDNESDAY to "الأربعاء",
        Calendar.THURSDAY to "الخميس",
        Calendar.FRIDAY to "الجمعة",
        Calendar.SATURDAY to "السبت"
    )

    data class ParsedDate(val month: Int, val day: Int, val birthYear: Int? = null)

    fun parseMonthAndDay(annualDateStr: String): ParsedDate {
        if (annualDateStr.isBlank()) return ParsedDate(0, 1)
        val parts = annualDateStr.split("-").mapNotNull { it.toIntOrNull() }
        return when (parts.size) {
            3 -> ParsedDate(month = parts[1] - 1, day = parts[2], birthYear = parts[0])
            2 -> ParsedDate(month = parts[0] - 1, day = parts[1])
            else -> ParsedDate(0, 1)
        }
    }

    fun getNextOccurrence(annualDateStr: String, referenceCal: Calendar = Calendar.getInstance()): Calendar {
        val (month, day) = parseMonthAndDay(annualDateStr)
        val now = referenceCal.clone() as Calendar
        now.set(Calendar.HOUR_OF_DAY, 0)
        now.set(Calendar.MINUTE, 0)
        now.set(Calendar.SECOND, 0)
        now.set(Calendar.MILLISECOND, 0)

        var targetYear = now.get(Calendar.YEAR)
        var targetDay = day

        // Handle Feb 29
        if (month == 1 && day == 29) {
            val isLeapYear = (targetYear % 4 == 0 && targetYear % 100 != 0) || (targetYear % 400 == 0)
            if (!isLeapYear) targetDay = 28
        }

        val nextCal = Calendar.getInstance().apply {
            set(Calendar.YEAR, targetYear)
            set(Calendar.MONTH, month)
            set(Calendar.DAY_OF_MONTH, targetDay)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }

        if (nextCal.before(now)) {
            targetYear += 1
            if (month == 1 && day == 29) {
                val isLeapYear = (targetYear % 4 == 0 && targetYear % 100 != 0) || (targetYear % 400 == 0)
                targetDay = if (isLeapYear) 29 else 28
            }
            nextCal.apply {
                set(Calendar.YEAR, targetYear)
                set(Calendar.MONTH, month)
                set(Calendar.DAY_OF_MONTH, targetDay)
            }
        }

        return nextCal
    }

    fun getDaysRemaining(annualDateStr: String, referenceCal: Calendar = Calendar.getInstance()): Int {
        val today = referenceCal.clone() as Calendar
        today.set(Calendar.HOUR_OF_DAY, 0)
        today.set(Calendar.MINUTE, 0)
        today.set(Calendar.SECOND, 0)
        today.set(Calendar.MILLISECOND, 0)

        val nextOccurrence = getNextOccurrence(annualDateStr, today)
        val diffMs = nextOccurrence.timeInMillis - today.timeInMillis
        val diffDays = Math.round(diffMs.toDouble() / (1000 * 60 * 60 * 24)).toInt()
        return Math.max(0, diffDays)
    }

    fun formatDaysRemainingText(days: Int): String {
        return when {
            days == 0 -> "اليوم!"
            days == 1 -> "غداً"
            days == 2 -> "بعد يومين"
            days in 3..10 -> "بعد $days أيام"
            else -> "بعد $days يوماً"
        }
    }

    fun formatAnnualDateArabic(annualDateStr: String): String {
        val (month, day) = parseMonthAndDay(annualDateStr)
        val monthName = ARABIC_MONTHS.getOrNull(month) ?: ""
        return "$day $monthName"
    }

    data class TodayArabicFormatted(
        val gregorian: String,
        val hijri: String,
        val weekday: String
    )

    fun getFormattedTodayArabic(): TodayArabicFormatted {
        val now = Calendar.getInstance()
        val weekdayStr = ARABIC_WEEKDAYS[now.get(Calendar.DAY_OF_WEEK)] ?: "اليوم"
        val day = now.get(Calendar.DAY_OF_MONTH)
        val monthStr = ARABIC_MONTHS.getOrNull(now.get(Calendar.MONTH)) ?: ""
        val year = now.get(Calendar.YEAR)
        val gregorian = "$day $monthStr $year م"

        var hijri = ""
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                val islamicDate = java.time.chrono.HijrahDate.now()
                val formatter = java.time.format.DateTimeFormatter.ofPattern("d MMMM yyyy", Locale("ar"))
                hijri = islamicDate.format(formatter) + " هـ"
            }
        } catch (_: Exception) {
            hijri = ""
        }

        return TodayArabicFormatted(gregorian = gregorian, hijri = hijri, weekday = weekdayStr)
    }

    fun sortPeopleByUpcoming(people: List<Person>): List<Person> {
        val now = Calendar.getInstance()
        return people.sortedBy { getDaysRemaining(it.annualDate, now) }
    }
}
