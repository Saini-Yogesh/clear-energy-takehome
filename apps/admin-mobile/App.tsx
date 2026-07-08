import React from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PendingActionsScreen } from './src/screens/PendingActionsScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Handled globally by the custom Axios client interceptor
      refetchOnWindowFocus: false,
    },
  },
});

const Stack = createNativeStackNavigator();

export default function App() {
  const isDark = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              },
              headerTintColor: isDark ? '#F8FAFC' : '#0F172A',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              },
            }}
          >
            <Stack.Screen
              name="PendingActions"
              component={PendingActionsScreen}
              options={{ title: 'Pending Actions' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
