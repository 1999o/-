package com.tathkeer.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tathkeer.app.ui.theme.Emerald500
import com.tathkeer.app.ui.theme.Emerald900
import com.tathkeer.app.ui.theme.Slate400
import com.tathkeer.app.ui.theme.White
import com.tathkeer.app.ui.viewmodel.ActiveTab

@Composable
fun AppNavigationBar(
    activeTab: ActiveTab,
    onTabSelected: (ActiveTab) -> Unit
) {
    NavigationBar(
        containerColor = Emerald900,
        tonalElevation = 8.dp
    ) {
        NavigationBarItem(
            selected = activeTab == ActiveTab.HOME,
            onClick = { onTabSelected(ActiveTab.HOME) },
            icon = {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = "الرئيسية"
                )
            },
            label = {
                Text(
                    text = "الرئيسية",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = White,
                selectedTextColor = White,
                indicatorColor = Emerald500.copy(alpha = 0.3f),
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400
            )
        )

        NavigationBarItem(
            selected = activeTab == ActiveTab.PEOPLE,
            onClick = { onTabSelected(ActiveTab.PEOPLE) },
            icon = {
                Icon(
                    imageVector = Icons.Default.People,
                    contentDescription = "الأحبة والأقارب"
                )
            },
            label = {
                Text(
                    text = "الأحبة والأقارب",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = White,
                selectedTextColor = White,
                indicatorColor = Emerald500.copy(alpha = 0.3f),
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400
            )
        )

        NavigationBarItem(
            selected = activeTab == ActiveTab.SETTINGS,
            onClick = { onTabSelected(ActiveTab.SETTINGS) },
            icon = {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "الإعدادات"
                )
            },
            label = {
                Text(
                    text = "الإعدادات",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = White,
                selectedTextColor = White,
                indicatorColor = Emerald500.copy(alpha = 0.3f),
                unselectedIconColor = Slate400,
                unselectedTextColor = Slate400
            )
        )
    }
}
