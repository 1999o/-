package com.tathkeer.app.ui.screens

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
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.data.model.Person
import com.tathkeer.app.ui.components.PersonCard
import com.tathkeer.app.ui.theme.Emerald600
import com.tathkeer.app.ui.theme.Emerald700
import com.tathkeer.app.ui.theme.White
import com.tathkeer.app.utils.DateUtils

@Composable
fun PeopleScreen(
    people: List<Person>,
    onAddPerson: () -> Unit,
    onEditPerson: (Person) -> Unit,
    onDeletePersonRequest: (Person) -> Unit,
    onViewPersonDetails: (Person) -> Unit,
    onWhatsApp: (Person) -> Unit,
    onCall: (Person) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }

    val filteredList = people.filter { person ->
        person.name.contains(searchQuery, ignoreCase = true) ||
                (person.notes?.contains(searchQuery, ignoreCase = true) ?: false)
    }.sortedBy { it.name }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Title bar
            item {
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
                            imageVector = Icons.Default.People,
                            contentDescription = "دليل الأحبة والأقارب",
                            tint = Emerald700
                        )
                        Text(
                            text = "دليل الأحبة والواصلين (${people.size})",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Emerald700
                        )
                    }

                    Button(
                        onClick = onAddPerson,
                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(text = "إضافة جديد +", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Search input
            item {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("ابحث في أسماء الأحبة أو الملاحظات...") },
                    leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = "بحث") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Emerald600
                    )
                )
            }

            if (filteredList.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 32.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "لا توجد نتائج مطابقة للبحث",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    }
                }
            } else {
                items(filteredList, key = { it.id }) { person ->
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
