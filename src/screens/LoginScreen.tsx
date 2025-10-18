import { AppButton, AppText, FormInput, ScreenWrapper } from '@/components';
import { useLoginMutation } from '@/hooks/useLoginMutation';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
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

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const loginMutation = useLoginMutation();

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
              <AppText variant="caption" color="secondary" center>
                Demo credentials:
              </AppText>
              <AppText variant="caption" color="secondary" center style={{ marginTop: 4 }}>
                Username: emilys | Password: emilyspass
              </AppText>
            </HelpTextContainer>
          </FormContainer>
        </LoginContainer>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
