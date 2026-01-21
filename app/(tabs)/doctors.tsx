import { Badge, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Search, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    consultation_fee: number;
    rating: number;
    total_reviews: number;
    is_available: boolean;
    image_url?: string;
}

export default function DoctorsScreen() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .order('rating', { ascending: false });

            if (error) throw error;
            setDoctors(data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <Text className="text-white text-2xl font-bold mb-4">Doctors</Text>

                {/* Search Bar */}
                <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search doctors...</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {doctors.length === 0 ? (
                    <View className="items-center py-12">
                        <Text className="text-gray-500 text-lg">No doctors found</Text>
                    </View>
                ) : (
                    <View className="flex-row flex-wrap justify-between">
                        {doctors.map((doctor) => (
                            <TouchableOpacity
                                key={doctor.id}
                                className="w-[48%] mb-4"
                                onPress={() => router.push(`/doctor/${doctor.id}`)}
                            >
                                <Card className="p-3 items-center">
                                    <View className="w-20 h-20 rounded-full bg-gray-200 mb-3 overflow-hidden">
                                        <Image
                                            source={{ uri: doctor.image_url || 'https://via.placeholder.com/100' }}
                                            className="w-full h-full"
                                        />
                                    </View>
                                    <Text className="font-bold text-gray-800 text-center mb-1" numberOfLines={1}>
                                        {doctor.name}
                                    </Text>
                                    <Text className="text-primary text-xs font-semibold mb-2">
                                        {doctor.specialty}
                                    </Text>
                                    <View className="flex-row items-center justify-between w-full">
                                        <Text className="text-gray-600 font-bold">${doctor.consultation_fee}</Text>
                                        <View className="flex-row items-center">
                                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                                            <Text className="text-xs text-gray-500 ml-1">{doctor.rating}</Text>
                                        </View>
                                    </View>
                                    {doctor.is_available ? (
                                        <Badge text="Available" variant="success" className="mt-2" />
                                    ) : (
                                        <Badge text="Unavailable" variant="secondary" className="mt-2" />
                                    )}
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <View className="h-20" />
            </ScrollView>
        </View>
    );
}
