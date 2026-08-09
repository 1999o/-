package com.tathkeer.app.data.db

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.tathkeer.app.data.model.Person

@Entity(tableName = "people")
data class PersonEntity(
    @PrimaryKey val id: String,
    val name: String,
    val annualDate: String,
    val phone: String?,
    val image: String?,
    val notes: String?,
    val reminderTime: String,
    val reminderDaysBefore: Int,
    val createdAt: String
) {
    fun toPerson() = Person(
        id = id,
        name = name,
        annualDate = annualDate,
        phone = phone,
        image = image,
        notes = notes,
        reminderTime = reminderTime,
        reminderDaysBefore = reminderDaysBefore,
        createdAt = createdAt
    )

    companion object {
        fun fromPerson(person: Person) = PersonEntity(
            id = person.id,
            name = person.name,
            annualDate = person.annualDate,
            phone = person.phone,
            image = person.image,
            notes = person.notes,
            reminderTime = person.reminderTime,
            reminderDaysBefore = person.reminderDaysBefore,
            createdAt = person.createdAt
        )
    }
}
