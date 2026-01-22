import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const setUser = useStore((state) => state.setUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        console.log('LoginScreen: Attempting login with email:', email);
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            console.log('LoginScreen: Calling signInWithPassword...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            });

            console.log('LoginScreen: signInWithPassword result', { data, error });

            if (error) {
                console.error('LoginScreen: signInWithPassword ERROR:', error);
                throw error;
            }

            if (data.user) {
                console.log('LoginScreen: Login successful, user ID:', data.user.id);
                // Fetch user profile
                console.log('LoginScreen: Fetching user profile...');
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('LoginScreen: Profile fetch ERROR:', profileError);
                    throw profileError;
                }

                console.log('LoginScreen: Profile fetched', profile);

                if (profile) {
                    setUser({
                        id: profile.id,
                        firstName: profile.first_name,
                        lastName: profile.last_name,
                        phone: profile.phone,
                        email: profile.email,
                        roles: profile.roles,
                        activeRole: profile.active_role,
                    });
                }

                router.replace('/(tabs)');
            }
        } catch (error: any) {
            console.error('LoginScreen: CATCH ERROR:', error);
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 justify-center px-6">
                <View className="items-center mb-10">
                    <Image
                        source={require('@/assets/images/home-icon.png')}
                        className="w-64 h-24"
                        resizeMode="contain"
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-4xl font-bold text-primary mb-2">Welcome Back</Text>
                    <Text className="text-gray-600">Sign in to continue to TreatSync</Text>
                </View>

                <View className="mb-6">
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon={<Mail size={20} color="#6B7280" />}
                    />
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                        icon={<Lock size={20} color="#6B7280" />}
                    />
                </View>

                <Button
                    title={loading ? "Signing in..." : "Sign In"}
                    onPress={handleLogin}
                    disabled={loading}
                />

                <TouchableOpacity className="mt-4">
                    <Text className="text-primary text-center">Forgot Password?</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/signup-step-one')}>
                        <Text className="text-primary font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
