/**
 * Add Friend Screen
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/atoms/Button';
import { Card } from '../../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';
import { useEffectiveColorScheme } from '../../../src/hooks/useEffectiveColorScheme';
import { useSocialStore } from '../../../src/stores/socialStore';

export default function AddFriendScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const { addFriend } = useSocialStore();
  const [friendEmail, setFriendEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    if (!friendEmail.trim() || !friendName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement friend request logic with actual userId lookup
      await addFriend(friendEmail, friendName);
      router.back();
    } catch (error) {
      console.error('Failed to add friend:', error);
    } finally {
      setIsLoading(false);
    }
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>Add Friend</Text>
          <View style={{ width: 60 }} />
        </View>

        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={[styles.subtitle, { color: colors.textPrimary }]}>Invite a Friend</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Share your recovery journey with friends. Accountability helps!
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Friend's Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
              placeholder="Friend's Name"
              placeholderTextColor={colors.textTertiary}
              value={friendName}
              onChangeText={setFriendName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Friend's Email</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.background }]}
              placeholder="friend@example.com"
              placeholderTextColor={colors.textTertiary}
              value={friendEmail}
              onChangeText={setFriendEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            label={isLoading ? 'Sending...' : 'Send Invite'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleAddFriend}
            disabled={isLoading || !friendEmail.trim() || !friendName.trim()}
          />
        </Card>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  subtitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    ...TYPOGRAPHY.body,
  },
});
