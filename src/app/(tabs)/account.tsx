import { AppButton, AppText } from '@/components';
import { useTheme } from '@/contexts/ThemeContext';
import { signOutApp } from '@/services/auth';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

const TOKEN_KEY = 'authToken';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const GradientHeader = styled(LinearGradient)`
  padding-top: 60px;
  padding-bottom: 40px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

const ContentWrapper = styled(View)`
  flex: 1;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
`;

const ProfileSection = styled(View)`
  align-items: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
`;

const AvatarContainer = styled(View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  shadow-color: ${({ theme }: any) => theme.shadows.elevated.shadowColor};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.12;
  shadow-radius: 16px;
  elevation: 8;
  border-width: 4px;
  border-color: ${({ theme }: any) => theme.colors.surface};
`;

const UserInfoCard = styled(View)`
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.radii.lg}px;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  shadow-color: ${({ theme }: any) => theme.shadows.standard.shadowColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border_light};
`;

const ThemeToggleCard = styled(View)`
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.radii.lg}px;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
  shadow-color: ${({ theme }: any) => theme.shadows.standard.shadowColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const ThemeToggleRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ThemeOptionsRow = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
  gap: ${({ theme }: any) => theme.spacing.sm}px;
`;

const ThemeOption = styled(TouchableOpacity)<{ isActive: boolean }>`
  flex: 1;
  background-color: ${({ theme, isActive }: any) => 
    isActive ? theme.colors.primary : theme.colors.background};
  padding: ${({ theme }: any) => theme.spacing.md}px;
  border-radius: ${({ theme }: any) => theme.radii.md}px;
  align-items: center;
  border-width: 2px;
  border-color: ${({ theme, isActive }: any) => 
    isActive ? theme.colors.primary : theme.colors.border_light};
`;

const BadgeContainer = styled(LinearGradient)`
  padding: ${({ theme }: any) => theme.spacing.xs}px ${({ theme }: any) => theme.spacing.md}px;
  border-radius: ${({ theme }: any) => theme.radii.pill}px;
  margin-top: ${({ theme }: any) => theme.spacing.sm}px;
`;

const ButtonContainer = styled(View)`
  margin-top: auto;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
`;

/**
 * Account Screen
 * Displays user profile information, theme toggle, and sign out functionality
 */
export default function AccountScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSuperadmin = useSelector((state: RootState) => state.auth.isSuperadmin);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { theme: currentTheme, themeMode, setThemeMode, isDark } = useTheme();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOutApp(queryClient, dispatch as any);
          },
        },
      ]
    );
  };

  const getThemeIcon = (mode: string) => {
    switch (mode) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'auto':
        return 'phone-portrait';
      default:
        return 'sunny';
    }
  };

  return (
    <Container contentContainerStyle={{ flexGrow: 1 }}>
      <GradientHeader
        colors={currentTheme.colors.gradient_primary as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ProfileSection>
          <AvatarContainer>
            <Ionicons name="person" size={60} color={currentTheme.colors.primary} />
          </AvatarContainer>
          <AppText 
            variant="headline" 
            style={{ 
              color: currentTheme.colors.text_onDark,
              fontSize: 28,
              fontWeight: '700' 
            }}
          >
            {user?.firstName} {user?.lastName}
          </AppText>
          <AppText 
            variant="body" 
            style={{ 
              color: currentTheme.colors.text_onDark,
              marginTop: 4,
              opacity: 0.9 
            }}
          >
            @{user?.username}
          </AppText>
          {isSuperadmin && (
            <BadgeContainer
              colors={currentTheme.colors.gradient_accent as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <AppText 
                variant="caption" 
                style={{ 
                  color: currentTheme.colors.text_onDark,
                  fontWeight: '600' 
                }}
              >
                ⭐ Superadmin
              </AppText>
            </BadgeContainer>
          )}
        </ProfileSection>
      </GradientHeader>

      <ContentWrapper>
        <ThemeToggleCard>
          <ThemeToggleRow>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons 
                name={getThemeIcon(themeMode) as any} 
                size={24} 
                color={currentTheme.colors.primary} 
              />
              <View>
                <AppText variant="body" style={{ fontWeight: '600' }}>
                  Appearance
                </AppText>
                <AppText variant="caption" color="secondary">
                  {themeMode === 'auto' ? 'System' : themeMode === 'dark' ? 'Dark' : 'Light'} mode
                </AppText>
              </View>
            </View>
          </ThemeToggleRow>
          
          <ThemeOptionsRow>
            <ThemeOption 
              isActive={themeMode === 'light'}
              onPress={() => setThemeMode('light')}
            >
              <Ionicons 
                name="sunny" 
                size={24} 
                color={themeMode === 'light' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary} 
              />
              <AppText 
                variant="caption" 
                style={{ 
                  marginTop: 4,
                  color: themeMode === 'light' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary,
                  fontWeight: themeMode === 'light' ? '600' : '400'
                }}
              >
                Light
              </AppText>
            </ThemeOption>

            <ThemeOption 
              isActive={themeMode === 'dark'}
              onPress={() => setThemeMode('dark')}
            >
              <Ionicons 
                name="moon" 
                size={24} 
                color={themeMode === 'dark' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary} 
              />
              <AppText 
                variant="caption" 
                style={{ 
                  marginTop: 4,
                  color: themeMode === 'dark' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary,
                  fontWeight: themeMode === 'dark' ? '600' : '400'
                }}
              >
                Dark
              </AppText>
            </ThemeOption>

            <ThemeOption 
              isActive={themeMode === 'auto'}
              onPress={() => setThemeMode('auto')}
            >
              <Ionicons 
                name="phone-portrait" 
                size={24} 
                color={themeMode === 'auto' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary} 
              />
              <AppText 
                variant="caption" 
                style={{ 
                  marginTop: 4,
                  color: themeMode === 'auto' ? currentTheme.colors.text_onPrimary : currentTheme.colors.text_secondary,
                  fontWeight: themeMode === 'auto' ? '600' : '400'
                }}
              >
                Auto
              </AppText>
            </ThemeOption>
          </ThemeOptionsRow>
        </ThemeToggleCard>

        <UserInfoCard>
          <InfoRow>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="mail" size={20} color={currentTheme.colors.text_secondary} />
              <AppText variant="body" color="secondary">Email</AppText>
            </View>
            <AppText variant="body" style={{ fontWeight: '500' }}>{user?.email}</AppText>
          </InfoRow>
          <InfoRow>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="person-outline" size={20} color={currentTheme.colors.text_secondary} />
              <AppText variant="body" color="secondary">Gender</AppText>
            </View>
            <AppText variant="body" style={{ fontWeight: '500' }}>{user?.gender}</AppText>
          </InfoRow>
          <InfoRow style={{ borderBottomWidth: 0 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="key-outline" size={20} color={currentTheme.colors.text_secondary} />
              <AppText variant="body" color="secondary">User ID</AppText>
            </View>
            <AppText variant="body" style={{ fontWeight: '500' }}>{user?.id}</AppText>
          </InfoRow>
        </UserInfoCard>

        <ButtonContainer>
          <AppButton
            title="Sign Out"
            onPress={handleSignOut}
            variant="danger"
            fullWidth
          />
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
}
