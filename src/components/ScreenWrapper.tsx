import { useNetInfo } from '@react-native-community/netinfo';
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

const OfflineIndicator = styled.View`
  background-color: #ff3b30;
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

const OfflineText = styled.Text`
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
`;

export const ScreenWrapper: React.FC<ScreenWrapperProps & { scrollable?: boolean }> = ({
  children,
  noPadding = false,
  backgroundColor,
  scrollable = false,
  ...props
}) => {
  const netInfo = useNetInfo();
  const isOffline = netInfo.isConnected === false;

  return (
    <Container noPadding={noPadding} backgroundColor={backgroundColor} {...props}>
      <StatusBar style="auto" />
      {isOffline && (
        <OfflineIndicator>
          <OfflineText>No Internet Connection</OfflineText>
        </OfflineIndicator>
      )}
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
