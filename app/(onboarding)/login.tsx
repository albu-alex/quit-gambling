/**
 * Login Screen
 * Email/password authentication
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
import { logIn } from '../../src/services/firebase/auth';
import { useUserStore } from '../../src/stores/userStore';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const authUser = await logIn(email.trim(), password);
      
      // Update Zustand store with authenticated user
      useUserStore.setState({
        userId: authUser.uid,
        userEmail: authUser.email,
        isAuthenticated: true,
        isOnboarded: true, // User exists, so they're considered onboarded
      });

      // Navigate to main app
      router.replace('/(main)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Unable to log in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    // Navigate to signup screen
    router.push({ pathname: '/signup' } as any);
  };

  const handleBackToWelcome = () => {
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
          <TouchableOpacity onPress={handleBackToWelcome} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🔐</Text>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to your account to continue your recovery journey
            </Text>
          </View>

          {/* Form Card */}
          <Card variant="flat" padding={SPACING.lg}>
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
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Login Button */}
          <Button
            label={loading ? 'Signing in...' : 'Sign In'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
            disabled={loading}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Sign Up CTA */}
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleSignup} disabled={loading}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>Create one</Text>
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
  forgotPasswordContainer: {
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    fontSize: TYPOGRAPHY.label.fontSize,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  signupText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    marginRight: SPACING.xs,
  },
  signupLink: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  footer: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
