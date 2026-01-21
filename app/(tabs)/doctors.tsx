import { Badge, Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    image: string;
    fee: number;
    isAvailable: boolean;
}

export default function DoctorsScreen() {
    const router = useRouter();

    const doctors: Doctor[] = [
        {
            id: '1',
            name: 'Dr. Sarafaraz',
            specialty: 'Cardiology',
            image: 'https://via.placeholder.com/100',
            fee: 15.00,
            isAvailable: true,
        },
        {
            id: '2',
            name: 'Dr. Simeon',
            specialty: 'Dermatology',
            image: 'https://via.placeholder.com/100',
            fee: 12.00,
            isAvailable: true,
        },
        {
            id: '3',
            name: 'Dr. Laurence',
            specialty: 'Pediatrics',
            image: 'https://via.placeholder.com/100',
            fee: 10.00,
            isAvailable: false,
        },
        {
            id: '4',
            name: 'Dr. Samrawit',
            specialty: 'Neurology',
            image: 'https://via.placeholder.com/100',
            fee: 18.00,
            isAvailable: true,
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold mb-4">MedLink</Text>

                {/* Search Bar */}
                <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search doctors...</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="text-xl font-bold text-gray-800 mb-4">Available Doctors</Text>

                <View className="flex-row flex-wrap justify-between">
                    {doctors.map((doctor) => (
                        <TouchableOpacity
                            key={doctor.id}
                            className="w-[48%] mb-4"
                            onPress={() => router.push(`/doctor/${doctor.id}` as any)}
                        >
                            <Card className="items-center p-4">
                                <Image
                                    source={{ uri: doctor.image }}
                                    className="w-20 h-20 rounded-full mb-3"
                                />
                                <Text className="font-bold text-gray-800 text-center">{doctor.name}</Text>
                                <Text className="text-gray-500 text-sm text-center mb-2">{doctor.specialty}</Text>
                                <Text className="text-primary font-bold mb-3">${doctor.fee.toFixed(2)}</Text>

                                {doctor.isAvailable ? (
                                    <Badge text="Book Appointment" variant="success" className="w-full" />
                                ) : (
                                    <Badge text="Unavailable" variant="default" className="w-full" />
                                )}
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
