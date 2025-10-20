import { AppButton, AppText, FormInput } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoginMutation } from '@/hooks/useLoginMutation';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const GradientBackground = styled(LinearGradient)`
  flex: 1;
`;

const LoginContainer = styled(ScrollView)`
  flex: 1;
`;

const ContentWrapper = styled(View)`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
  min-height: 600px;
`;

const LogoContainer = styled(View)`
  align-items: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.xl * 2}px;
`;

const IconCircle = styled(View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  shadow-color: ${({ theme }: any) => theme.shadows.elevated.shadowColor};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.12;
  shadow-radius: 16px;
  elevation: 8;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
`;

const FormContainer = styled(View)`
  width: 100%;
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.radii.xl}px;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
  shadow-color: ${({ theme }: any) => theme.shadows.elevated.shadowColor};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.12;
  shadow-radius: 16px;
  elevation: 8;
`;

const ButtonContainer = styled(View)`
  margin-top: ${({ theme }: any) => theme.spacing.lg}px;
`;

const HelpTextContainer = styled(View)`
  margin-top: ${({ theme }: any) => theme.spacing.lg}px;
  align-items: center;
`;

const DemoCredentialsCard = styled(View)`
  background-color: ${({ theme }: any) => theme.colors.background_secondary};
  border-radius: ${({ theme }: any) => theme.radii.md}px;
  padding: ${({ theme }: any) => theme.spacing.md}px;
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border_light};
`;

/**
 * Root index route - handles authentication routing
 * - If user is authenticated (has token), redirect to main app
 * - If user is not authenticated, show login screen
 */
export default function Index() {
  const token = useSelector((state: RootState) => state.auth.token);
  const { theme } = useTheme();
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
    <GradientBackground
      colors={theme.colors.gradient_primary as any}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <LoginContainer contentContainerStyle={{ flexGrow: 1 }}>
          <ContentWrapper>
            <LogoContainer>
              <IconCircle>
                <Ionicons name="storefront" size={60} color={theme.colors.primary} />
              </IconCircle>
              <AppText 
                variant="headline" 
                center 
                style={{ 
                  color: theme.colors.text_onDark,
                  fontSize: 32,
                  fontWeight: '700' 
                }}
              >
                GetPayInStore
              </AppText>
              <AppText 
                variant="body" 
                center 
                style={{ 
                  marginTop: 8,
                  color: theme.colors.text_onDark,
                  opacity: 0.9 
                }}
              >
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
                leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text_secondary} />}
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
                leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text_secondary} />}
                rightIcon={
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.text_secondary}
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

              <DemoCredentialsCard>
                <AppText 
                  variant="caption" 
                  color="secondary" 
                  center 
                  style={{ fontWeight: '600' }}
                >
                  Demo Credentials:
                </AppText>
                <AppText 
                  variant="caption" 
                  color="secondary" 
                  center 
                  style={{ marginTop: 4 }}
                >
                  Superadmin: emilys | Pass: emilyspass
                </AppText>
                <AppText 
                  variant="caption" 
                  color="secondary" 
                  center 
                  style={{ marginTop: 2 }}
                >
                  User: averyp | Pass: averyppass
                </AppText>
              </DemoCredentialsCard>
            </FormContainer>
          </ContentWrapper>
        </LoginContainer>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
