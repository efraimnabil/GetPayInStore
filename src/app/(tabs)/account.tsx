import { AppButton, AppText } from '@/components';
import { signOutApp } from '@/services/auth';
import { RootState } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

const TOKEN_KEY = 'authToken';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const ContentWrapper = styled(View)`
  flex: 1;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

const ProfileSection = styled(View)`
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xl}px;
`;

const AvatarContainer = styled(View)`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${({ theme }: any) => theme.colors.primary_light};
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
`;

const UserInfo = styled(View)`
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.radii.md}px;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xl}px;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }: any) => theme.spacing.sm}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
`;

const ButtonContainer = styled(View)`
  margin-top: auto;
`;

/**
 * Account Screen
 * Displays user profile information and sign out functionality
 */
export default function AccountScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSuperadmin = useSelector((state: RootState) => state.auth.isSuperadmin);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

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
            // Navigation will be handled automatically by _layout.tsx
            // when it detects auth state change
          },
        },
      ]
    );
  };

  return (
    <Container contentContainerStyle={{ flexGrow: 1 }}>
      <ContentWrapper>
        <ProfileSection>
          <AvatarContainer>
            <Ionicons name="person" size={50} color="#007AFF" />
          </AvatarContainer>
          <AppText variant="headline">
            {user?.firstName} {user?.lastName}
          </AppText>
          <AppText variant="body" color="secondary" style={{ marginTop: 4 }}>
            @{user?.username}
          </AppText>
          {isSuperadmin && (
            <AppText variant="caption" color="primary" style={{ marginTop: 8 }}>
              ⭐ Superadmin
            </AppText>
          )}
        </ProfileSection>

        <UserInfo>
          <InfoRow>
            <AppText variant="body" color="secondary">Email</AppText>
            <AppText variant="body">{user?.email}</AppText>
          </InfoRow>
          <InfoRow>
            <AppText variant="body" color="secondary">Gender</AppText>
            <AppText variant="body">{user?.gender}</AppText>
          </InfoRow>
          <InfoRow style={{ borderBottomWidth: 0 }}>
            <AppText variant="body" color="secondary">User ID</AppText>
            <AppText variant="body">{user?.id}</AppText>
          </InfoRow>
        </UserInfo>

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
