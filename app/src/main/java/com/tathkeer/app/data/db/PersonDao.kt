package com.tathkeer.app.data.db

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface PersonDao {
    @Query("SELECT * FROM people ORDER BY createdAt DESC")
    fun getAllPeopleFlow(): Flow<List<PersonEntity>>

    @Query("SELECT * FROM people ORDER BY createdAt DESC")
    suspend fun getAllPeople(): List<PersonEntity>

    @Query("SELECT * FROM people WHERE id = :id")
    suspend fun getPersonById(id: String): PersonEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPerson(person: PersonEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPeople(people: List<PersonEntity>)

    @Query("DELETE FROM people WHERE id = :id")
    suspend fun deletePersonById(id: String)

    @Query("DELETE FROM people")
    suspend fun deleteAll()
}
