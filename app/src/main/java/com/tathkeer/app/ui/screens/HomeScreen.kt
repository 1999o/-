package com.tathkeer.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.data.model.Person
import com.tathkeer.app.ui.components.PersonCard
import com.tathkeer.app.ui.theme.Emerald500
import com.tathkeer.app.ui.theme.Emerald600
import com.tathkeer.app.ui.theme.Emerald700
import com.tathkeer.app.ui.theme.Emerald900
import com.tathkeer.app.ui.theme.White
import com.tathkeer.app.utils.DateUtils

@Composable
fun HomeScreen(
    people: List<Person>,
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    filterType: String,
    onFilterTypeChange: (String) -> Unit,
    onAddPerson: () -> Unit,
    onEditPerson: (Person) -> Unit,
    onDeletePersonRequest: (Person) -> Unit,
    onViewPersonDetails: (Person) -> Unit,
    onWhatsApp: (Person) -> Unit,
    onCall: (Person) -> Unit
) {
    val todayInfo = DateUtils.getFormattedTodayArabic()
    val sortedPeople = DateUtils.sortPeopleByUpcoming(people)

    val filteredPeople = sortedPeople.filter { person ->
        val matchesSearch = person.name.contains(searchQuery, ignoreCase = true) ||
                (person.notes?.contains(searchQuery, ignoreCase = true) ?: false)

        val daysRemaining = DateUtils.getDaysRemaining(person.annualDate)
        val matchesFilter = when (filterType) {
            "today" -> daysRemaining in 0..1
            "month" -> daysRemaining in 0..30
            else -> true
        }

        matchesSearch && matchesFilter
    }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Date Summary Card (Gregorian + Hijri)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Emerald900),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CalendarMonth,
                                    contentDescription = "التاريخ",
                                    tint = Emerald500
                                )
                                Text(
                                    text = todayInfo.weekday,
                                    color = White,
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }

                            Text(
                                text = "اليوم الحالي 🌟",
                                color = Emerald500,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = todayInfo.gregorian,
                                color = White.copy(alpha = 0.9f),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium
                            )

                            if (todayInfo.hijri.isNotEmpty()) {
                                Text(
                                    text = todayInfo.hijri,
                                    color = Emerald500,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }

            // Quick Stats Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val totalCount = people.size
                    val upcomingWeek = people.count { DateUtils.getDaysRemaining(it.annualDate) in 0..7 }
                    val upcomingMonth = people.count { DateUtils.getDaysRemaining(it.annualDate) in 0..30 }

                    StatCard(
                        title = "إجمالي المسجلين",
                        value = totalCount.toString(),
                        modifier = Modifier.weight(1f)
                    )
                    StatCard(
                        title = "تذكير هذا الأسبوع",
                        value = upcomingWeek.toString(),
                        modifier = Modifier.weight(1f)
                    )
                    StatCard(
                        title = "تذكير هذا الشهر",
                        value = upcomingMonth.toString(),
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            // Search & Filter controls
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = onSearchQueryChange,
                        placeholder = { Text("بحث باسم الشخص أو الملاحظات...") },
                        leadingIcon = {
                            Icon(imageVector = Icons.Default.Search, contentDescription = "بحث")
                        },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Emerald600
                        )
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        listOf("all" to "الكل", "today" to "اليوم وفعال", "month" to "هذا الشهر").forEach { (type, label) ->
                            val selected = filterType == type
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (selected) Emerald600 else MaterialTheme.colorScheme.surface)
                                    .clickable { onFilterTypeChange(type) }
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
            }

            // People List Cards
            if (filteredPeople.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(text = "🌱", fontSize = 40.sp)
                            Text(
                                text = "لا توجد تذكيرات مطابقة حالياً",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "اضغط على زر (+) لإضافة شخص عزيز وتذكير بصلته",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                }
            } else {
                items(filteredPeople, key = { it.id }) { person ->
                    PersonCard(
                        person = person,
                        onViewDetails = { onViewPersonDetails(person) },
                        onEdit = { onEditPerson(person) },
                        onDelete = { onDeletePersonRequest(person) },
                        onWhatsApp = { onWhatsApp(person) },
                        onCall = { onCall(person) }
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(80.dp)) }
        }

        // Floating Action Button
        FloatingActionButton(
            onClick = onAddPerson,
            containerColor = Emerald600,
            contentColor = White,
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(20.dp)
        ) {
            Icon(imageVector = Icons.Default.Add, contentDescription = "إضافة شخص")
        }
    }
}

@Composable
private fun StatCard(title: String, value: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Emerald700
            )
            Text(
                text = title,
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                fontWeight = FontWeight.Medium
            )
        }
    }
}
