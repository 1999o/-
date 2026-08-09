package com.tathkeer.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.tathkeer.app.ui.components.AddEditPersonDialog
import com.tathkeer.app.ui.components.AppNavigationBar
import com.tathkeer.app.ui.components.DeleteConfirmationDialog
import com.tathkeer.app.ui.components.Header
import com.tathkeer.app.ui.components.PersonDetailsDialog
import com.tathkeer.app.ui.screens.HomeScreen
import com.tathkeer.app.ui.screens.PeopleScreen
import com.tathkeer.app.ui.screens.SettingsScreen
import com.tathkeer.app.ui.theme.Emerald700
import com.tathkeer.app.ui.theme.TathkeerTheme
import com.tathkeer.app.ui.theme.White
import com.tathkeer.app.ui.viewmodel.ActiveTab
import com.tathkeer.app.ui.viewmodel.MainViewModel
import com.tathkeer.app.utils.ContactUtils
import com.tathkeer.app.utils.DateUtils

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    private val requestNotificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted ->
            if (isGranted) {
                viewModel.showToast("تم تفعيل إذن الإشعارات بنجاح")
            } else {
                viewModel.showToast("لم يتم إعطاء إذن الإشعارات")
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()

        checkNotificationPermission()

        setContent {
            val settings by viewModel.settings.collectAsState()
            val people by viewModel.people.collectAsState()
            val activeTab by viewModel.activeTab.collectAsState()
            val searchQuery by viewModel.searchQuery.collectAsState()
            val filterType by viewModel.filterType.collectAsState()
            val toastMsg by viewModel.toastMsg.collectAsState()

            val isAddEditOpen by viewModel.isAddEditOpen.collectAsState()
            val personToEdit by viewModel.personToEdit.collectAsState()

            val isDeleteOpen by viewModel.isDeleteOpen.collectAsState()
            val personToDelete by viewModel.personToDelete.collectAsState()

            val isDetailsOpen by viewModel.isDetailsOpen.collectAsState()
            val personToView by viewModel.personToView.collectAsState()

            val activeRemindersCount = people.count { DateUtils.getDaysRemaining(it.annualDate) in 0..1 }

            TathkeerTheme(themeSetting = settings.theme) {
                // Force Right-To-Left (RTL) for Arabic UI
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    Scaffold(
                        topBar = {
                            Header(
                                theme = settings.theme,
                                onToggleTheme = {
                                    val nextTheme = if (settings.theme == "dark") "light" else "dark"
                                    viewModel.updateSettings(settings.copy(theme = nextTheme))
                                },
                                activeRemindersCount = activeRemindersCount,
                                onOpenNotifications = {
                                    if (activeRemindersCount > 0) {
                                        viewModel.showToast("لديك $activeRemindersCount تذكيرات مستحقة اليوم أو غداً!")
                                    } else {
                                        viewModel.showToast("لا توجد تذكيرات مستحقة حالياً")
                                    }
                                }
                            )
                        },
                        bottomBar = {
                            AppNavigationBar(
                                activeTab = activeTab,
                                onTabSelected = { viewModel.setActiveTab(it) }
                            )
                        }
                    ) { innerPadding ->
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                                .background(MaterialTheme.colorScheme.background)
                        ) {
                            Crossfade(targetState = activeTab, label = "TabSwitch") { tab ->
                                when (tab) {
                                    ActiveTab.HOME -> {
                                        HomeScreen(
                                            people = people,
                                            searchQuery = searchQuery,
                                            onSearchQueryChange = { viewModel.setSearchQuery(it) },
                                            filterType = filterType,
                                            onFilterTypeChange = { viewModel.setFilterType(it) },
                                            onAddPerson = { viewModel.openAddDialog() },
                                            onEditPerson = { viewModel.openEditDialog(it) },
                                            onDeletePersonRequest = { viewModel.openDeleteDialog(it) },
                                            onViewPersonDetails = { viewModel.openDetailsDialog(it) },
                                            onWhatsApp = {
                                                ContactUtils.openWhatsApp(
                                                    this@MainActivity,
                                                    it.phone,
                                                    ContactUtils.generateWhatsAppGreeting(it.name)
                                                )
                                            },
                                            onCall = { ContactUtils.makePhoneCall(this@MainActivity, it.phone) }
                                        )
                                    }

                                    ActiveTab.PEOPLE -> {
                                        PeopleScreen(
                                            people = people,
                                            onAddPerson = { viewModel.openAddDialog() },
                                            onEditPerson = { viewModel.openEditDialog(it) },
                                            onDeletePersonRequest = { viewModel.openDeleteDialog(it) },
                                            onViewPersonDetails = { viewModel.openDetailsDialog(it) },
                                            onWhatsApp = {
                                                ContactUtils.openWhatsApp(
                                                    this@MainActivity,
                                                    it.phone,
                                                    ContactUtils.generateWhatsAppGreeting(it.name)
                                                )
                                            },
                                            onCall = { ContactUtils.makePhoneCall(this@MainActivity, it.phone) }
                                        )
                                    }

                                    ActiveTab.SETTINGS -> {
                                        SettingsScreen(
                                            settings = settings,
                                            onUpdateSettings = { viewModel.updateSettings(it) },
                                            onExportBackup = { viewModel.exportBackupJson() },
                                            onImportBackup = { viewModel.importBackupJson(it) },
                                            onResetData = { viewModel.resetData() },
                                            showToast = { viewModel.showToast(it) }
                                        )
                                    }
                                }
                            }

                            // Toast Message Banner
                            toastMsg?.let { msg ->
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopCenter)
                                        .padding(top = 16.dp)
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(Emerald700)
                                        .padding(horizontal = 16.dp, vertical = 10.dp)
                                ) {
                                    Text(
                                        text = "✨ $msg",
                                        color = White,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }

                        // Dialogs
                        if (isAddEditOpen) {
                            AddEditPersonDialog(
                                personToEdit = personToEdit,
                                onDismiss = { viewModel.closeAddEditDialog() },
                                onSave = { viewModel.savePerson(it) }
                            )
                        }

                        if (isDeleteOpen) {
                            DeleteConfirmationDialog(
                                person = personToDelete,
                                onDismiss = { viewModel.closeDeleteDialog() },
                                onConfirm = { viewModel.confirmDelete() }
                            )
                        }

                        if (isDetailsOpen) {
                            PersonDetailsDialog(
                                person = personToView,
                                onDismiss = { viewModel.closeDetailsDialog() },
                                onWhatsApp = { msg ->
                                    ContactUtils.openWhatsApp(
                                        this@MainActivity,
                                        personToView?.phone,
                                        msg
                                    )
                                },
                                onCall = { ContactUtils.makePhoneCall(this@MainActivity, personToView?.phone) }
                            )
                        }
                    }
                }
            }
        }
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                requestNotificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }
}
