package com.tathkeer.app.data.repository

import android.content.Context
import com.tathkeer.app.data.db.AppDatabase
import com.tathkeer.app.data.db.PersonEntity
import com.tathkeer.app.data.model.Person
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class PersonRepository(private val context: Context) {
    private val db = AppDatabase.getDatabase(context)
    private val personDao = db.personDao()

    val peopleFlow: Flow<List<Person>> = personDao.getAllPeopleFlow().map { entities ->
        entities.map { it.toPerson() }
    }

    suspend fun getAllPeople(): List<Person> {
        val entities = personDao.getAllPeople()
        if (entities.isEmpty()) {
            val initialList = getInitialPeople()
            personDao.insertPeople(initialList.map { PersonEntity.fromPerson(it) })
            return initialList
        }
        return entities.map { it.toPerson() }
    }

    suspend fun savePerson(person: Person) {
        personDao.insertPerson(PersonEntity.fromPerson(person))
    }

    suspend fun deletePerson(id: String) {
        personDao.deletePersonById(id)
    }

    suspend fun restorePeople(people: List<Person>) {
        personDao.deleteAll()
        personDao.insertPeople(people.map { PersonEntity.fromPerson(it) })
    }

    suspend fun clearAll() {
        personDao.deleteAll()
    }

    private fun getInitialPeople(): List<Person> {
        return listOf(
            Person(
                id = "sample-1",
                name = "والدتي العزيزة",
                annualDate = "1970-05-15",
                phone = "0501234567",
                notes = "دعوة صادقة وهدية بسيطة لادخال السرور عليها",
                reminderTime = "08:30",
                reminderDaysBefore = 1
            ),
            Person(
                id = "sample-2",
                name = "أبو فهد (صديق العمر)",
                annualDate = "1988-08-20",
                phone = "0559876543",
                notes = "اللقاء والاطمئنان عليه وتهنئته بذكراه السنوية",
                reminderTime = "09:00",
                reminderDaysBefore = 0
            ),
            Person(
                id = "sample-3",
                name = "العم أبو أحمد",
                annualDate = "1965-11-04",
                phone = "0541122334",
                notes = "زيارة منزلية صلةً للرحم واطمئنان على صحته",
                reminderTime = "10:00",
                reminderDaysBefore = 3
            ),
            Person(
                id = "sample-4",
                name = "خالتي أمل",
                annualDate = "1975-01-12",
                phone = "0563344556",
                notes = "إرسال رسالة تودد ودعاء بالمحبة والعافية",
                reminderTime = "09:30",
                reminderDaysBefore = 0
            )
        )
    }
}
