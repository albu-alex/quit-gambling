/**
 * Signup Screen
 * Create new account with email/password
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { useEffectiveColorScheme } from '../../src/hooks/useEffectiveColorScheme';
import { signUp } from '../../src/services/firebase/auth';
import { useUserStore } from '../../src/stores/userStore';

export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Validation Error', 'Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      const authUser = await signUp(email.trim(), password, displayName.trim());
      
      // Update Zustand store with new user
      useUserStore.setState({
        userId: authUser.uid,
        userEmail: authUser.email,
        isAuthenticated: true,
        isOnboarded: false, // New user, needs to complete onboarding
      });

      // Navigate to questionnaire to complete onboarding
      router.replace({ pathname: '/questionnaire' } as any);
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Unable to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🚀</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Start your recovery journey today
            </Text>
          </View>

          {/* Form Card */}
          <Card variant="flat" padding={SPACING.lg}>
            {/* Display Name Field */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Full Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Your name"
                placeholderTextColor={colors.textTertiary}
                value={displayName}
                onChangeText={setDisplayName}
                editable={!loading}
                autoCapitalize="words"
                testID="name-input"
              />
            </View>

            {/* Email Field */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                testID="email-input"
              />
            </View>

            {/* Password Field */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.textPrimary }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                  secureTextEntry={!showPassword}
                  testID="password-input"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.helperText, { color: colors.textTertiary }]}>
                Min. 8 characters
              </Text>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Confirm Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  {
                    backgroundColor: colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: colors.textPrimary }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                  secureTextEntry={!showConfirmPassword}
                  testID="confirm-password-input"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreedToTerms ? colors.primary : colors.surfaceLight,
                    borderColor: colors.border,
                  },
                ]}
              >
                {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                I agree to the Terms & Conditions
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Signup Button */}
          <Button
            label={loading ? 'Creating account...' : 'Create Account'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSignup}
            disabled={loading}
          />

          {/* Already have account */}
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={handleBackToLogin} disabled={loading}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { color: colors.textTertiary }]}>
            Your data is encrypted and never shared. Recovery is always possible. 💪
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    marginBottom: SPACING.md,
  },
  backButtonText: {
    fontSize: TYPOGRAPHY.label.fontSize,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.h2.fontSize,
    fontWeight: TYPOGRAPHY.h2.fontWeight as any,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body.fontSize,
    lineHeight: TYPOGRAPHY.body.lineHeight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.label.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  eyeIcon: {
    fontSize: 20,
    paddingLeft: SPACING.sm,
  },
  helperText: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    marginTop: SPACING.xs,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  loginText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginRight: SPACING.xs,
  },
  loginLink: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  footer: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
