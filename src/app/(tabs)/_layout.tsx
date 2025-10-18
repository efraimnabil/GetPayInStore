import { useSession } from '@/hooks/useSession';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

/**
 * Protected Tab Layout
 * - Checks for authenticated session using useSession hook
 * - Shows loading spinner while session is being restored
 * - Redirects to login if no user is authenticated
 * - Renders tab navigator if user is authenticated
 */
export default function TabLayout() {
  const { user, isLoading } = useSession();

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Redirect to login if no user is authenticated
  if (!user) {
    return <Redirect href="/" />;
  }

  // Render tabs if user is authenticated
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: true,
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />,
          headerTitle: 'Products',
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: 'Category',
          tabBarIcon: ({ color }) => <Ionicons name="grid-outline" size={24} color={color} />,
          headerTitle: 'Categories',
        }}
      />
      <Tabs.Screen
        name="signOut"
        options={{
          title: 'Sign Out',
          tabBarIcon: ({ color }) => <Ionicons name="log-out-outline" size={24} color={color} />,
          headerTitle: 'Account',
        }}
      />
    </Tabs>
  );
}
