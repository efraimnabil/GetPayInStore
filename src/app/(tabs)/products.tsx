import { AppText, ScreenWrapper } from '@/components';
import { RootState } from '@/store/store';
import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

const WelcomeText = styled(AppText)`
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
`;

/**
 * Products Screen
 * Placeholder screen for displaying products
 */
export default function ProductsScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ScreenWrapper>
      <Container>
        <WelcomeText variant="headline">
          Welcome, {user?.firstName || 'User'}!
        </WelcomeText>
        <AppText variant="body" color="secondary" center>
          This is the Products screen.
        </AppText>
        <AppText variant="body" color="secondary" center style={{ marginTop: 16 }}>
          Product listings will be displayed here.
        </AppText>
      </Container>
    </ScreenWrapper>
  );
}
