import { AppButton, AppText, FormInput, ProductCard, ScreenWrapper } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function TabOneScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  return (
    <ScreenWrapper scrollable>
      <AppText variant="headline" center>
        GetPayInStore
      </AppText>
      
      <AppText variant="body" color="secondary" center style={{ marginTop: 8, marginBottom: 24 }}>
        Welcome to your new component-based app
      </AppText>
    </ScreenWrapper>
  );
}
