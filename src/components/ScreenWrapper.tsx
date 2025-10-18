import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
  backgroundColor?: string;
}

const Container = styled(SafeAreaView)<{ noPadding?: boolean; backgroundColor?: string }>`
  flex: 1;
  background-color: ${({ theme, backgroundColor }) => backgroundColor || theme?.colors?.background || '#F2F2F7'};
  padding: ${({ theme, noPadding }) => (noPadding ? 0 : (theme?.spacing?.md || 16))}px;
`;

const ScrollContainer = styled.ScrollView<{ noPadding?: boolean }>`
  flex: 1;
`;

export const ScreenWrapper: React.FC<ScreenWrapperProps & { scrollable?: boolean }> = ({
  children,
  noPadding = false,
  backgroundColor,
  scrollable = false,
  ...props
}) => {
  return (
    <Container noPadding={noPadding} backgroundColor={backgroundColor} {...props}>
      <StatusBar style="auto" />
      {scrollable ? (
        <ScrollContainer
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollContainer>
      ) : (
        children
      )}
    </Container>
  );
};
