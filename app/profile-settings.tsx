import { Button, Card, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { storageService } from '@/services/storageService';
import { useStore } from '@/store/store';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Camera, CreditCard, Mail, MapPin, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileSettingsScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    // Convert avatarUrl to proper prop if it exists
    const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl || null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        email: user?.email || '',
    });

    const savedAddresses = [
        { id: '1', label: 'Home', address: '123 Main Street, Harare', isDefault: true },
        { id: '2', label: 'Work', address: '456 Office Park, Harare', isDefault: false },
    ];

    const paymentMethods = [
        { id: '1', type: 'Ecocash', number: '**** 1234', isDefault: true },
        { id: '2', type: 'Visa', number: '**** 5678', isDefault: false },
    ];

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                uploadAvatar(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadAvatar = async (uri: string) => {
        if (!user) return;

        try {
            setUploading(true);

            // Create a file object from uri
            const response = await fetch(uri);
            const blob = await response.blob();

            // Upload to Supabase
            const publicUrl = await storageService.uploadAvatar(user.id, blob);

            // Update profile in database
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (error) throw error;

            // Update local state and store
            setAvatar(publicUrl);
            setUser({ ...user, avatarUrl: publicUrl });

            Alert.alert('Success', 'Profile photo updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to upload image. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    phone: formData.phone,
                    email: formData.email
                })
                .eq('id', user.id);

            if (error) throw error;

            setUser({
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email
            });

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
            console.error(error);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Profile Settings</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Avatar Section */}
                <View className="items-center mb-6">
                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                        <View className="w-24 h-24 rounded-full bg-white items-center justify-center border-2 border-primary mb-2 overflow-hidden shadow-sm">
                            {uploading ? (
                                <ActivityIndicator color="#1E3A8A" />
                            ) : avatar ? (
                                <Image source={{ uri: avatar }} className="w-full h-full" />
                            ) : (
                                <User size={40} color="#1E3A8A" />
                            )}
                        </View>
                        <View className="absolute bottom-2 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white">
                            <Camera size={14} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-gray-500 text-sm">Tap to change photo</Text>
                </View>

                {/* Personal Information */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Personal Information</Text>
                <Card className="mb-6">
                    <Input
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        label="First Name"
                        placeholder="First Name"
                        icon={<User size={20} color="#6B7280" />}
                    />
                    <Input
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        label="Last Name"
                        placeholder="Last Name"
                        icon={<User size={20} color="#6B7280" />}
                    />
                    <Input
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        label="Phone"
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        icon={<Phone size={20} color="#6B7280" />}
                    />
                    <Input
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        label="Email"
                        placeholder="Email (Optional)"
                        keyboardType="email-address"
                        icon={<Mail size={20} color="#6B7280" />}
                    />
                    <Button title="Save Changes" onPress={handleSaveProfile} />
                </Card>

                {/* Delivery Addresses */}
                <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-gray-800">Delivery Addresses</Text>
                    <TouchableOpacity>
                        <Text className="text-primary font-semibold">+ Add New</Text>
                    </TouchableOpacity>
                </View>
                {savedAddresses.map((address) => (
                    <Card key={address.id} className="mb-3 flex-row items-start">
                        <MapPin size={20} color="#6B7280" className="mt-1" />
                        <View className="flex-1 ml-3">
                            <View className="flex-row items-center mb-1">
                                <Text className="font-bold text-gray-800">{address.label}</Text>
                                {address.isDefault && (
                                    <View className="ml-2 bg-primary px-2 py-1 rounded">
                                        <Text className="text-white text-xs">Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-gray-600 text-sm">{address.address}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-primary text-sm">Edit</Text>
                        </TouchableOpacity>
                    </Card>
                ))}

                {/* Payment Methods */}
                <View className="flex-row justify-between items-center mb-3 mt-6">
                    <Text className="text-lg font-bold text-gray-800">Payment Methods</Text>
                    <TouchableOpacity>
                        <Text className="text-primary font-semibold">+ Add New</Text>
                    </TouchableOpacity>
                </View>
                {paymentMethods.map((method) => (
                    <Card key={method.id} className="mb-3 flex-row items-center">
                        <CreditCard size={20} color="#6B7280" />
                        <View className="flex-1 ml-3">
                            <View className="flex-row items-center mb-1">
                                <Text className="font-bold text-gray-800">{method.type}</Text>
                                {method.isDefault && (
                                    <View className="ml-2 bg-primary px-2 py-1 rounded">
                                        <Text className="text-white text-xs">Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-gray-600 text-sm">{method.number}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-primary text-sm">Edit</Text>
                        </TouchableOpacity>
                    </Card>
                ))}

                {/* Notifications */}
                <Text className="text-lg font-bold text-gray-800 mb-3 mt-6">Notifications</Text>
                <Card className="mb-6">
                    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                        <View className="flex-row items-center flex-1">
                            <Bell size={20} color="#6B7280" />
                            <Text className="ml-3 text-gray-800">Order Updates</Text>
                        </View>
                        <View className="w-12 h-6 bg-primary rounded-full" />
                    </View>
                    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                        <View className="flex-row items-center flex-1">
                            <Bell size={20} color="#6B7280" />
                            <Text className="ml-3 text-gray-800">Promotions</Text>
                        </View>
                        <View className="w-12 h-6 bg-gray-300 rounded-full" />
                    </View>
                    <View className="flex-row justify-between items-center py-3">
                        <View className="flex-row items-center flex-1">
                            <Bell size={20} color="#6B7280" />
                            <Text className="ml-3 text-gray-800">New Messages</Text>
                        </View>
                        <View className="w-12 h-6 bg-primary rounded-full" />
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}
