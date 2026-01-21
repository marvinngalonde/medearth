import { Card } from '@/components/ui';
import { UserRole, useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { Building2, ChevronRight, LogOut, Truck, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const currentRole = useStore((state) => state.currentRole);
    const setCurrentRole = useStore((state) => state.setCurrentRole);
    const logout = useStore((state) => state.logout);

    const roles: { id: UserRole; label: string; icon: any; description: string }[] = [
        { id: 'patient', label: 'Personal', icon: User, description: 'Patient Account' },
        { id: 'pharmacy', label: 'City Pharmacy', icon: Building2, description: 'Pharmacy Account' },
        { id: 'driver', label: 'Fast Bikes', icon: Truck, description: 'Driver Account' },
    ];

    const handleRoleSwitch = (role: UserRole) => {
        setCurrentRole(role);

        // Navigate to appropriate dashboard
        if (role === 'pharmacy') {
            router.push('/pharmacy/dashboard');
        } else if (role === 'driver') {
            router.push('/driver/dashboard');
        }
    };

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-8 px-6 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold">MedLink</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Menu Items */}
                <View className="mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/order-history' as any)}
                        className="mb-3"
                    >
                        <Card className="flex-row items-center justify-between p-4">
                            <Text className="text-gray-800 font-medium">Order History</Text>
                            <Text className="text-gray-400">›</Text>
                        </Card>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push('/profile-settings' as any)}
                        className="mb-3"
                    >
                        <Card className="flex-row items-center justify-between p-4">
                            <Text className="text-gray-800 font-medium">Settings</Text>
                            <Text className="text-gray-400">›</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Switch Profile Section */}
                {/* User Profile */}
                <Card className="items-center py-6 mb-6">
                    <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-3">
                        <Text className="text-white text-3xl font-bold">
                            {user?.firstName?.[0] || 'U'}
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-gray-800">
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <Text className="text-gray-500 mt-1">{user?.phone}</Text>
                </Card>

                {/* Role Switcher */}
                <Text className="text-lg font-bold text-gray-800 mb-4">Switch Profile</Text>

                {roles.map((role) => (
                    <TouchableOpacity
                        key={role.id}
                        onPress={() => handleRoleSwitch(role.id)}
                        className="mb-3"
                    >
                        <Card className={`flex-row items-center justify-between p-4 ${currentRole === role.id ? 'border-2 border-primary' : ''
                            }`}>
                            <View className="flex-row items-center flex-1">
                                <View className={`w-12 h-12 rounded-full items-center justify-center ${currentRole === role.id ? 'bg-primary' : 'bg-gray-100'
                                    }`}>
                                    <role.icon
                                        size={24}
                                        color={currentRole === role.id ? '#FFFFFF' : '#6B7280'}
                                    />
                                </View>
                                <View className="ml-4 flex-1">
                                    <Text className="font-bold text-gray-800">{role.label}</Text>
                                    <Text className="text-gray-500 text-sm">{role.description}</Text>
                                </View>
                            </View>
                            <ChevronRight size={20} color="#6B7280" />
                        </Card>
                    </TouchableOpacity>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="mt-6 mb-8"
                >
                    <Card className="flex-row items-center justify-center p-4 bg-red-50">
                        <LogOut size={20} color="#EF4444" />
                        <Text className="ml-2 text-danger font-semibold">Logout</Text>
                    </Card>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
