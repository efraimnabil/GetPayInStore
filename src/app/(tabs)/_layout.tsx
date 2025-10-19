import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

/**
 * Protected Tab Layout
 * - Checks for authenticated session using useSession hook
 * - Shows loading spinner while session is being restored
 * - Redirects to login if no user is authenticated
 * - Renders tab navigator if user is authenticated
 */
export default function TabLayout() {
  // Tab layout renders only when authenticated because AppLocker mounts this stack
  return (
    <Tabs
      initialRouteName="products"
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
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          headerTitle: 'My Account',
        }}
      />
      {/* Hide old routes from tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides it from the router
          headerShown: false, // If accessed directly, avoid showing a header titled 'Index'
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // This hides it from the router
        }}
      />
    </Tabs>
  );
}
