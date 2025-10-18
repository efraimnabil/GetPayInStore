import { AppText, ScreenWrapper } from '@/components';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.xl}px;
`;

/**
 * Category Screen
 * Placeholder screen for displaying product categories
 */
export default function CategoryScreen() {
  return (
    <ScreenWrapper>
      <Container>
        <AppText variant="headline" style={{ marginBottom: 16 }}>
          Categories
        </AppText>
        <AppText variant="body" color="secondary" center>
          This is the Category screen.
        </AppText>
        <AppText variant="body" color="secondary" center style={{ marginTop: 16 }}>
          Product categories will be displayed here.
        </AppText>
      </Container>
    </ScreenWrapper>
  );
}
