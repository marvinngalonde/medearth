import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css'; // Import NativeWind CSS

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    console.log('RootLayout: Checking initial session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('RootLayout: getSession result', session ? 'Session found' : 'No session');
      if (session) {
        // Fetch user profile and set in store
        console.log('RootLayout: Fetching profile for user', session.user.id);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('RootLayout: Error fetching profile', error);
            }
            if (profile) {
              console.log('RootLayout: Profile found, updating store and redirecting');
              setUser({
                id: profile.id,
                firstName: profile.first_name,
                lastName: profile.last_name,
                phone: profile.phone,
                email: profile.email,
                roles: profile.roles,
                activeRole: profile.active_role,
              });
              router.replace('/(tabs)');
            } else {
              console.log('RootLayout: No profile found for user');
            }
          });
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('RootLayout: onAuthStateChange', _event, session ? 'Session active' : 'No session');
      if (session) {
        // Handle session updates if needed
        // Assuming user data is already in store or fetched above
      } else {
        // User logged out
        console.log('RootLayout: User logged out, redirecting to login');
        router.replace('/');
      }
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup-step-one" options={{ headerShown: false }} />
        <Stack.Screen name="signup-step-two" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product Details' }} />
        <Stack.Screen name="pharmacy/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="doctor/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ title: 'Cart & Checkout' }} />
        <Stack.Screen name="order-confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="tracking/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="conversation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="appointment-booking" options={{ headerShown: false }} />
        <Stack.Screen name="order-history" options={{ headerShown: false }} />
        <Stack.Screen name="profile-settings" options={{ headerShown: false }} />
        <Stack.Screen name="search-results" options={{ headerShown: false }} />
        <Stack.Screen name="pharmacy/dashboard" options={{ title: 'Pharmacy Dashboard' }} />
        <Stack.Screen name="pharmacy/products" options={{ headerShown: false }} />
        <Stack.Screen name="driver/dashboard" options={{ title: 'Driver Dashboard' }} />
        <Stack.Screen name="driver/job-details" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
