import { AppButton, AppText, FormInput, ScreenWrapper } from '@/components';
import { useLoginMutation } from '@/hooks/useLoginMutation';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const LoginContainer = styled(View)`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

const LogoContainer = styled(View)`
  align-items: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.xl * 2}px;
`;

const FormContainer = styled(View)`
  width: 100%;
`;

const ButtonContainer = styled(View)`
  margin-top: ${({ theme }: any) => theme.spacing.lg}px;
`;

const HelpTextContainer = styled(View)`
  margin-top: ${({ theme }: any) => theme.spacing.xl}px;
  align-items: center;
`;

/**
 * Root index route - handles authentication routing
 * - If user is authenticated (has token), redirect to main app
 * - If user is not authenticated, show login screen
 */
export default function Index() {
  const token = useSelector((state: RootState) => state.auth.token);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const loginMutation = useLoginMutation();

  // If user is already authenticated, redirect to main app (specific tab)
  // Only redirect if token exists and is truthy (not null/undefined/empty)
  if (token && token.length > 0) {
    return <Redirect href="/(tabs)/products" />;
  }

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Call the mutation
    loginMutation.mutate({
      username: username.trim(),
      password: password.trim(),
    });
  };

  return (
    <ScreenWrapper noPadding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <LoginContainer>
          <LogoContainer>
            <Ionicons name="storefront" size={80} color="#007AFF" />
            <AppText variant="headline" center style={{ marginTop: 16 }}>
              GetPayInStore
            </AppText>
            <AppText variant="body" color="secondary" center style={{ marginTop: 8 }}>
              Sign in to continue
            </AppText>
          </LogoContainer>

          <FormContainer>
            <FormInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) {
                  setErrors({ ...errors, username: undefined });
                }
              }}
              error={errors.username}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="person-outline" size={20} color="#8E8E93" />}
              editable={!loginMutation.isPending}
            />

            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              error={errors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />}
              rightIcon={
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#8E8E93"
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              editable={!loginMutation.isPending}
            />

            <ButtonContainer>
              <AppButton
                title={loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                onPress={handleLogin}
                isLoading={loginMutation.isPending}
                disabled={loginMutation.isPending}
                fullWidth
              />
            </ButtonContainer>

            <HelpTextContainer>
              <AppText variant="caption" color="secondary" center style={{ fontWeight: '600' }}>
                Demo Credentials:
              </AppText>
              <AppText variant="caption" color="secondary" center style={{ marginTop: 8 }}>
                Superadmin: emilys | Pass: emilyspass
              </AppText>
              <AppText variant="caption" color="secondary" center style={{ marginTop: 4 }}>
                User: averyp | Pass: averyppass
              </AppText>
            </HelpTextContainer>
          </FormContainer>
        </LoginContainer>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
