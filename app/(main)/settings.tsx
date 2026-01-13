/**
 * Settings Screen
 */

import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { UserStorage } from '../../src/data/storage/UserStorage';
import { useEffectiveColorScheme } from '../../src/hooks/useEffectiveColorScheme';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { useThemeStore } from '../../src/stores/themeStore';
import { useUserStore } from '../../src/stores/userStore';

export default function SettingsScreen() {
  const router = useRouter();
  const deviceColorScheme = useColorScheme();
  const effectiveColorScheme = useEffectiveColorScheme();
  const colors = COLORS[effectiveColorScheme === 'dark' ? 'dark' : 'light'];
  const userId = useUserStore((state) => state.userId);
  const themeMode = useThemeStore((state) => state.themeMode);
  const setThemeMode = useThemeStore((state) => state.setThemeMode);
  const [notificationsEnabled, toggleNotifications] = [
    useNotificationStore((state) => state.notificationsEnabled),
    useNotificationStore((state) => state.toggleNotifications),
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserStorage.deleteUserData(userId);
              // Reset store and navigate to onboarding
              useUserStore.setState({ isOnboarded: false });
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            useUserStore.setState({ isOnboarded: false });
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>

        {/* Account Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Account</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>User ID</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{userId.substring(0, 8)}...</Text>
            </View>
          </View>
        </Card>

        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Theme</Text>
          <View style={styles.themeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'light' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setThemeMode('light')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'light' ? colors.background : colors.textPrimary },
                ]}
              >
                ☀️ Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'dark' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setThemeMode('dark')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'dark' ? colors.background : colors.textPrimary },
                ]}
              >
                🌙 Dark
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                themeMode === 'system' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setThemeMode('system')}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'system' ? colors.background : colors.textPrimary },
                ]}
              >
                🔄 System
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.themeHint, { color: colors.textSecondary }]}>
            {themeMode === 'system'
              ? `Using ${deviceColorScheme || 'light'} mode from device settings`
              : `Using ${themeMode} mode`}
          </Text>
        </Card>

        {/* Notifications Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Notifications</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Daily Check-in Reminders</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>9:00 AM</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={notificationsEnabled ? colors.success : colors.textTertiary}
            />
          </View>
        </Card>

        {/* Privacy Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Privacy & Security</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <TouchableOpacity style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Data Encryption</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>Enabled (AES-256)</Text>
            </View>
            <Text style={styles.settingIcon}>🔒</Text>
          </TouchableOpacity>
        </Card>

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={[styles.aboutRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.aboutLabel, { color: colors.textPrimary }]}>Quit Gambling App</Text>
            <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>v1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={[styles.aboutLabel, { color: colors.textPrimary }]}>Made for Romania</Text>
            <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>🇷🇴</Text>
          </View>
        </Card>

        {/* Resources */}
        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={[styles.resourceTitle, { color: colors.textPrimary }]}>💬 Need Help?</Text>
          <TouchableOpacity style={[styles.resourceLink, { borderBottomColor: colors.border }]}>
            <Text style={[styles.resourceLinkText, { color: colors.primary }]}>
              National Hotline: 0800 XXX XXXX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.resourceLink, { borderBottomColor: colors.border }]}>
            <Text style={[styles.resourceLinkText, { color: colors.primary }]}>
              Gamblers Anonymous Romania Website →
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Text style={[styles.dangerSectionTitle, { color: colors.danger }]}>Danger Zone</Text>
        <Button
          label="Log Out"
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleLogout}
        />
        <Button
          label="Delete Account"
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleDeleteAccount}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  backButton: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
    marginTop: SPACING.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  settingValue: {
    ...TYPOGRAPHY.bodySmall,
  },
  settingIcon: {
    fontSize: 24,
  },
  themeButtonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  themeButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  themeHint: {
    ...TYPOGRAPHY.bodySmall,
    fontStyle: 'italic',
    marginTop: SPACING.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  aboutLabel: {
    ...TYPOGRAPHY.body,
  },
  aboutValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  resourceTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  resourceLink: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  resourceLinkText: {
    ...TYPOGRAPHY.body,
  },
  dangerSectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
});
