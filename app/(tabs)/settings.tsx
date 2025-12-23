/**
 * Settings Screen
 */

import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { UserStorage } from '../../src/data/storage/UserStorage';
import { useNotificationStore } from '../../src/stores/notificationStore';
import { useUserStore } from '../../src/stores/userStore';

export default function SettingsScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>User ID</Text>
              <Text style={styles.settingValue}>{userId.substring(0, 8)}...</Text>
            </View>
          </View>
        </Card>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Daily Check-in Reminders</Text>
              <Text style={styles.settingValue}>9:00 AM</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.success }}
              thumbColor={notificationsEnabled ? COLORS.success : COLORS.textTertiary}
            />
          </View>
        </Card>

        {/* Privacy Section */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <TouchableOpacity style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Data Encryption</Text>
              <Text style={styles.settingValue}>Enabled (AES-256)</Text>
            </View>
            <Text style={styles.settingIcon}>🔒</Text>
          </TouchableOpacity>
        </Card>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <Card variant="flat" padding={SPACING.lg}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Quit Gambling App</Text>
            <Text style={styles.aboutValue}>v1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Made for Romania</Text>
            <Text style={styles.aboutValue}>🇷🇴</Text>
          </View>
        </Card>

        {/* Resources */}
        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={styles.resourceTitle}>💬 Need Help?</Text>
          <TouchableOpacity style={styles.resourceLink}>
            <Text style={styles.resourceLinkText}>
              National Hotline: 0800 XXX XXXX
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resourceLink}>
            <Text style={styles.resourceLinkText}>
              Gamblers Anonymous Romania Website →
            </Text>
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Text style={styles.dangerSectionTitle}>Danger Zone</Text>
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
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
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  settingValue: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
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
    borderBottomColor: COLORS.border,
  },
  aboutLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  aboutValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  resourceTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  resourceLink: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resourceLinkText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
  },
  dangerSectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.danger,
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
  },
});
