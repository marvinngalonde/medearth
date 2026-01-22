import { Button, Input } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Lock, Mail, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
        } else if (!/^\+?[0-9]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone number';
            isValid = false;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        setLoading(true);

        // TODO: Implement actual Supabase signup
        setTimeout(() => {
            setLoading(false);
            router.replace('/');
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerClassName="flex-grow px-6 pt-12">
                <View className="items-center mb-8">
                    {/* Logo */}
                    <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-3">
                        <Text className="text-white text-3xl font-bold">M</Text>
                    </View>
                    <Text className="text-2xl font-bold text-primary">Create Account</Text>
                    <Text className="text-gray-500 mt-1">Join TreatSync today</Text>
                </View>

                <View className="mb-6">
                    <Input
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        placeholder="First Name"
                        label="First Name"
                        error={errors.firstName}
                        icon={<User size={20} color="#6B7280" />}
                    />

                    <Input
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        placeholder="Last Name"
                        label="Last Name"
                        error={errors.lastName}
                        icon={<User size={20} color="#6B7280" />}
                    />

                    <Input
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="Phone Number (+263...)"
                        label="Phone Number"
                        keyboardType="phone-pad"
                        error={errors.phone}
                        icon={<Phone size={20} color="#6B7280" />}
                    />

                    <Input
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Email (Optional)"
                        label="Email"
                        keyboardType="email-address"
                        error={errors.email}
                        icon={<Mail size={20} color="#6B7280" />}
                    />

                    <Input
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        placeholder="Password"
                        label="Password"
                        secureTextEntry
                        error={errors.password}
                        icon={<Lock size={20} color="#6B7280" />}
                    />

                    <Input
                        value={formData.confirmPassword}
                        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                        placeholder="Confirm Password"
                        label="Confirm Password"
                        secureTextEntry
                        error={errors.confirmPassword}
                        icon={<Lock size={20} color="#6B7280" />}
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        className="mt-4"
                    />
                </View>

                <View className="items-center mb-8">
                    <Text className="text-gray-600">
                        Already have an account?{' '}
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text className="text-primary font-semibold">Log In</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
