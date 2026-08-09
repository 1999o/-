package com.tathkeer.app.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.tathkeer.app.data.model.AppSettings
import com.tathkeer.app.data.model.Person
import com.tathkeer.app.data.repository.PersonRepository
import com.tathkeer.app.data.repository.SettingsRepository
import com.tathkeer.app.utils.DateUtils
import com.tathkeer.app.utils.NotificationScheduler
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class ActiveTab { HOME, PEOPLE, SETTINGS }

class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val personRepository = PersonRepository(application)
    private val settingsRepository = SettingsRepository(application)

    val people: StateFlow<List<Person>> = personRepository.peopleFlow
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val settings: StateFlow<AppSettings> = settingsRepository.settingsFlow

    private val _activeTab = MutableStateFlow(ActiveTab.HOME)
    val activeTab: StateFlow<ActiveTab> = _activeTab.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _filterType = MutableStateFlow("all") // "all", "today", "month"
    val filterType: StateFlow<String> = _filterType.asStateFlow()

    private val _toastMsg = MutableStateFlow<String?>(null)
    val toastMsg: StateFlow<String?> = _toastMsg.asStateFlow()

    // Dialog states
    private val _isAddEditOpen = MutableStateFlow(false)
    val isAddEditOpen: StateFlow<Boolean> = _isAddEditOpen.asStateFlow()

    private val _personToEdit = MutableStateFlow<Person?>(null)
    val personToEdit: StateFlow<Person?> = _personToEdit.asStateFlow()

    private val _isDeleteOpen = MutableStateFlow(false)
    val isDeleteOpen: StateFlow<Boolean> = _isDeleteOpen.asStateFlow()

    private val _personToDelete = MutableStateFlow<Person?>(null)
    val personToDelete: StateFlow<Person?> = _personToDelete.asStateFlow()

    private val _isDetailsOpen = MutableStateFlow(false)
    val isDetailsOpen: StateFlow<Boolean> = _isDetailsOpen.asStateFlow()

    private val _personToView = MutableStateFlow<Person?>(null)
    val personToView: StateFlow<Person?> = _personToView.asStateFlow()

    init {
        viewModelScope.launch {
            val list = personRepository.getAllPeople()
            if (settings.value.notificationsEnabled) {
                NotificationScheduler.scheduleAll(getApplication(), list)
            }
        }
    }

    fun setActiveTab(tab: ActiveTab) {
        _activeTab.value = tab
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setFilterType(filter: String) {
        _filterType.value = filter
    }

    fun showToast(message: String) {
        _toastMsg.value = message
        viewModelScope.launch {
            kotlinx.coroutines.delay(3000)
            if (_toastMsg.value == message) {
                _toastMsg.value = null
            }
        }
    }

    // Add / Edit Handlers
    fun openAddDialog() {
        _personToEdit.value = null
        _isAddEditOpen.value = true
    }

    fun openEditDialog(person: Person) {
        _personToEdit.value = person
        _isAddEditOpen.value = true
    }

    fun closeAddEditDialog() {
        _isAddEditOpen.value = false
        _personToEdit.value = null
    }

    fun savePerson(person: Person) {
        viewModelScope.launch {
            personRepository.savePerson(person)
            if (settings.value.notificationsEnabled) {
                NotificationScheduler.schedulePersonReminder(getApplication(), person)
            }
            closeAddEditDialog()
            showToast("تم حفظ بيانات الشخص بنجاح")
        }
    }

    // Delete Handlers
    fun openDeleteDialog(person: Person) {
        _personToDelete.value = person
        _isDeleteOpen.value = true
    }

    fun closeDeleteDialog() {
        _isDeleteOpen.value = false
        _personToDelete.value = null
    }

    fun confirmDelete() {
        val person = _personToDelete.value ?: return
        viewModelScope.launch {
            personRepository.deletePerson(person.id)
            NotificationScheduler.cancelPersonReminder(getApplication(), person.id)
            closeDeleteDialog()
            showToast("تم حذف الشخص بنجاح")
        }
    }

    // Details Handlers
    fun openDetailsDialog(person: Person) {
        _personToView.value = person
        _isDetailsOpen.value = true
    }

    fun closeDetailsDialog() {
        _isDetailsOpen.value = false
        _personToView.value = null
    }

    // Settings Handlers
    fun updateSettings(newSettings: AppSettings) {
        settingsRepository.updateSettings(newSettings)
        if (newSettings.notificationsEnabled) {
            viewModelScope.launch {
                val list = personRepository.getAllPeople()
                NotificationScheduler.scheduleAll(getApplication(), list)
            }
        }
        showToast("تم تحديث الإعدادات بنجاح")
    }

    // Backup & Restore
    fun exportBackupJson(): String {
        val list = people.value
        return Gson().toJson(list)
    }

    fun importBackupJson(jsonString: String): Boolean {
        return try {
            val type = object : TypeToken<List<Person>>() {}.type
            val importedList: List<Person> = Gson().fromJson(jsonString, type)
            if (importedList.isNotEmpty()) {
                viewModelScope.launch {
                    personRepository.restorePeople(importedList)
                    if (settings.value.notificationsEnabled) {
                        NotificationScheduler.scheduleAll(getApplication(), importedList)
                    }
                    showToast("تم استعادة البيانات بنجاح (${importedList.size} شخص)")
                }
                true
            } else false
        } catch (_: Exception) {
            false
        }
    }

    fun resetData() {
        viewModelScope.launch {
            personRepository.clearAll()
            showToast("تم مسح جميع البيانات")
        }
    }
}
