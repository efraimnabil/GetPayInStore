import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { AppText } from './AppText';

interface ProductCardProps {
  thumbnail: string | number; // URI string or local require()
  title: string;
  price?: string;
  onPress?: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

const Card = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.shadows.standard};
`;

const Thumbnail = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentContainer = styled(View)`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
`;

const DeleteButton = styled(TouchableOpacity)`
  padding: ${({ theme }) => theme.spacing.sm}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

export const ProductCard: React.FC<ProductCardProps> = ({
  thumbnail,
  title,
  price,
  onPress,
  onDelete,
  showDeleteButton = false,
}) => {
  const imageSource = typeof thumbnail === 'string' ? { uri: thumbnail } : thumbnail;

  return (
    <Card onPress={onPress} activeOpacity={onPress ? 0.7 : 1} disabled={!onPress}>
      <Thumbnail source={imageSource} resizeMode="cover" />
      <ContentContainer>
        <AppText variant="subtitle" bold numberOfLines={2}>
          {title}
        </AppText>
        {price && (
          <AppText variant="body" color="secondary" style={{ marginTop: 4 }}>
            {price}
          </AppText>
        )}
      </ContentContainer>
      {showDeleteButton && onDelete && (
        <DeleteButton onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </DeleteButton>
      )}
    </Card>
  );
};
