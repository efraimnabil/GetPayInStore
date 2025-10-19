import { AppText } from '@/components';
import React from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const ContentWrapper = styled(View)`
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
    <Container contentContainerStyle={{ flexGrow: 1 }}>
      <ContentWrapper>
        <AppText variant="headline" style={{ marginBottom: 16 }}>
          Categories
        </AppText>
        <AppText variant="body" color="secondary" center>
          This is the Category screen.
        </AppText>
        <AppText variant="body" color="secondary" center style={{ marginTop: 16 }}>
          Product categories will be displayed here.
        </AppText>
      </ContentWrapper>
    </Container>
  );
}
