import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const DOCTORS = [
    {
        id: '1',
        name: 'Dr. Sarah Wilson',
        specialty: 'Cardiologist',
        hospital: 'St. Mary\'s Hospital',
        rating: 4.8,
        reviews: 124,
        fee: '$80',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        availability: 'Available Today',
    },
    {
        id: '2',
        name: 'Dr. James Chen',
        specialty: 'Pediatrician',
        hospital: 'City Children\'s Center',
        rating: 4.9,
        reviews: 89,
        fee: '$60',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        availability: 'Next Available: Tomorrow',
    },
    {
        id: '3',
        name: 'Dr. Emily Brooks',
        specialty: 'Dermatologist',
        hospital: 'Skin Care Clinic',
        rating: 4.7,
        reviews: 210,
        fee: '$90',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        availability: 'Available Today',
    },
    {
        id: '4',
        name: 'Dr. Michael Ross',
        specialty: 'General Practitioner',
        hospital: 'Downtown Medical',
        rating: 4.6,
        reviews: 156,
        fee: '$50',
        image: 'https://randomuser.me/api/portraits/men/85.jpg',
        availability: 'Available in 1 hr',
    },
];

export default function DoctorsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const renderDoctor = ({ item }: { item: typeof DOCTORS[0] }) => (
        <TouchableOpacity
            className="bg-white p-4 mb-4 rounded-2xl shadow-sm border border-gray-100"
            onPress={() => router.push(`/doctor/${item.id}`)}
            style={theme.shadows.sm}
        >
            <View className="flex-row">
                <Image
                    source={{ uri: item.image }}
                    className="w-20 h-20 rounded-xl bg-gray-200"
                />
                <View className="flex-1 ml-4 justify-between">
                    <View>
                        <View className="flex-row justify-between items-start">
                            <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">{item.name}</Text>
                            <View className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-md">
                                <Star size={12} color={theme.colors.accent.DEFAULT} fill={theme.colors.accent.DEFAULT} />
                                <Text className="ml-1 text-xs font-bold text-yellow-700">{item.rating}</Text>
                            </View>
                        </View>
                        <Text className="text-primary font-medium text-sm">{item.specialty}</Text>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <MapPin size={12} color={theme.colors.gray[500]} />
                        <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>{item.hospital}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-50">
                <View>
                    <Text className="text-xs text-green-600 font-medium">{item.availability}</Text>
                    <Text className="text-sm font-bold text-gray-900 mt-0.5">{item.fee} <Text className="text-gray-400 font-normal">/ visit</Text></Text>
                </View>
                <View className="bg-primary px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold text-sm">Book Now</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <ScreenHeader
                title="Find a Doctor"
                subtitle="Specialist Directory"
                searchPlaceholder="Search doctors, specialties..."
                onSearch={setSearchQuery}
            />

            <FlatList
                data={DOCTORS}
                renderItem={renderDoctor}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            />
        </View>
    );
}
