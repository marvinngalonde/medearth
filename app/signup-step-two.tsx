import { Button, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function SignupStepTwoScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const setUser = useStore((state) => state.setUser);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: params.email as string,
                password: password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        first_name: params.firstName as string,
                        last_name: params.lastName as string,
                        phone: params.phone as string,
                        email: params.email as string,
                        roles: ['patient'],
                        active_role: 'patient',
                    });

                if (profileError) throw profileError;

                // Set user in store
                setUser({
                    id: authData.user.id,
                    firstName: params.firstName as string,
                    lastName: params.lastName as string,
                    phone: params.phone as string,
                    email: params.email as string,
                    roles: ['patient'],
                    activeRole: 'patient',
                });

                Alert.alert(
                    'Success',
                    'Account created successfully! Please check your email to verify your account.',
                    [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
                );
            }
        } catch (error: any) {
            Alert.alert('Signup Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 justify-center px-6">
                <View className="mb-8">
                    <Text className="text-4xl font-bold text-primary mb-2">Create Account</Text>
                    <Text className="text-gray-600">Step 2 of 2 - Set Password</Text>
                </View>

                <View className="mb-6">
                    <Input
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                        icon={<Lock size={20} color="#6B7280" />}
                    />
                    <Input
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        secureTextEntry
                        icon={<Lock size={20} color="#6B7280" />}
                    />
                    <Text className="text-gray-500 text-sm mt-2">
                        Password must be at least 6 characters
                    </Text>
                </View>

                <Button
                    title={loading ? "Creating Account..." : "Create Account"}
                    onPress={handleSignup}
                    disabled={loading}
                />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/')}>
                        <Text className="text-primary font-semibold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
