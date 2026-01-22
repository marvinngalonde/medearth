import { Button, Input } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Mail, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

export default function SignupStepOneScreen() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleNext = () => {
        if (!firstName || !lastName || !email || !phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Pass data to next step
        router.push({
            pathname: '/signup-step-two',
            params: { firstName, lastName, email, phone },
        } as any);
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
                    <Text className="text-4xl font-bold text-primary mb-2">Create Account</Text>
                    <Text className="text-gray-600">Step 1 of 2 - Basic Information</Text>
                </View>

                <View className="mb-6">
                    <Input
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                        icon={<User size={20} color="#6B7280" />}
                    />
                    <Input
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                        icon={<User size={20} color="#6B7280" />}
                    />
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        icon={<Mail size={20} color="#6B7280" />}
                    />
                    <Input
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        icon={<Phone size={20} color="#6B7280" />}
                    />
                </View>

                <Button
                    title="Next"
                    onPress={handleNext}
                />

                <View className="flex-row justify-center mt-6">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-primary font-semibold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
