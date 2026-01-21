import { Badge, Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Search, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Pharmacy {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryFee: number;
    deliveryTime: string;
    isOpen: boolean;
    tags: string[];
}

export default function PharmaciesScreen() {
    const router = useRouter();

    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const pharmacies: Pharmacy[] = [
        {
            id: '1',
            name: 'Highland Family Pharmacy',
            image: 'https://via.placeholder.com/300x150',
            rating: 4.8,
            deliveryFee: 0,
            deliveryTime: '15-20 min',
            isOpen: true,
            tags: ['Open Now', 'Lowest Delivery Fee'],
        },
        {
            id: '2',
            name: 'Highland Family Pharmacy',
            image: 'https://via.placeholder.com/300x150',
            rating: 4.5,
            deliveryFee: 2.5,
            deliveryTime: '20-25 min',
            isOpen: true,
            tags: ['Open Now'],
        },
    ];

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open Now' },
        { id: 'delivery', label: 'Lowest Delivery Fee' },
        { id: 'rating', label: 'Highest Rated' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold mb-4">MedLink</Text>

                {/* Search Bar */}
                <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search pharmacies...</Text>
                </TouchableOpacity>

                {/* Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-4 -mx-6 px-6"
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            onPress={() => setSelectedFilter(filter.id)}
                            className={`mr-2 px-4 py-2 rounded-full ${selectedFilter === filter.id ? 'bg-white' : 'bg-white/20'
                                }`}
                        >
                            <Text className={selectedFilter === filter.id ? 'text-primary font-semibold' : 'text-white'}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {pharmacies.map((pharmacy) => (
                    <TouchableOpacity
                        key={pharmacy.id}
                        onPress={() => router.push(`/pharmacy/${pharmacy.id}` as any)}
                        className="mb-4"
                    >
                        <Card className="flex-row overflow-hidden">
                            <Image
                                source={{ uri: pharmacy.image }}
                                className="w-full h-40"
                            />
                            <View className="p-4">
                                <View className="flex-row justify-between items-start mb-2">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800">{pharmacy.name}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                                            <Text className="ml-1 text-gray-600">{pharmacy.rating}</Text>
                                        </View>
                                    </View>
                                    {pharmacy.isOpen && (
                                        <Badge text="Open Now" variant="success" />
                                    )}
                                </View>

                                <View className="flex-row items-center justify-between mt-2">
                                    <View className="flex-row items-center">
                                        <Clock size={16} color="#6B7280" />
                                        <Text className="ml-1 text-gray-600 text-sm">{pharmacy.deliveryTime}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <MapPin size={16} color="#6B7280" />
                                        <Text className="ml-1 text-gray-600 text-sm">
                                            ${pharmacy.deliveryFee.toFixed(2)} delivery
                                        </Text>
                                    </View>
                                </View>

                                {pharmacy.tags.length > 0 && (
                                    <View className="flex-row mt-3">
                                        {pharmacy.tags.map((tag, index) => (
                                            <Badge key={index} text={tag} variant="info" className="mr-2" />
                                        ))}
                                    </View>
                                )}
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
