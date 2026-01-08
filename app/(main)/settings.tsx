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
import { useNotificationStore } from '../../src/stores/notificationStore';
import { useUserStore } from '../../src/stores/userStore';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const userId = useUserStore((state) => state.userId);
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
