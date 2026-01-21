import { Card } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Search, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Pharmacy {
    id: string;
    name: string;
    image_url: string;
    rating: number;
    delivery_fee: number;
    phone: string;
    address: string;
    is_active: boolean;
}

export default function PharmaciesScreen() {
    const router = useRouter();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open Now' },
        { id: 'delivery', label: 'Lowest Delivery Fee' },
        { id: 'rating', label: 'Highest Rated' },
    ];

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            const { data, error } = await supabase
                .from('pharmacies')
                .select('*')
                .eq('is_active', true)
                .order('rating', { ascending: false });

            if (error) throw error;
            setPharmacies(data || []);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
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
                <Text className="text-white text-2xl font-bold mb-4">Pharmacies</Text>

                {/* Search Bar */}
                <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search pharmacies...</Text>
                </View>
            </View>

            {/* Filters */}
            <View className="py-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.id}
                            onPress={() => setSelectedFilter(filter.id)}
                            className={`mr-3 px-4 py-2 rounded-full border ${selectedFilter === filter.id
                                    ? 'bg-primary border-primary'
                                    : 'bg-white border-gray-200'
                                }`}
                        >
                            <Text
                                className={
                                    selectedFilter === filter.id ? 'text-white' : 'text-gray-600'
                                }
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView className="flex-1 px-6">
                {pharmacies.length === 0 ? (
                    <View className="items-center py-12">
                        <Text className="text-gray-500 text-lg">No pharmacies found</Text>
                    </View>
                ) : (
                    pharmacies.map((pharmacy) => (
                        <TouchableOpacity
                            key={pharmacy.id}
                            onPress={() => router.push(`/pharmacy/${pharmacy.id}`)}
                            className="mb-4"
                        >
                            <Card className="p-0 overflow-hidden">
                                <Image
                                    source={{ uri: pharmacy.image_url || 'https://via.placeholder.com/300x150' }}
                                    className="w-full h-40"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text className="text-lg font-bold text-gray-800 flex-1 mr-2">
                                            {pharmacy.name}
                                        </Text>
                                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded">
                                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                            <Text className="ml-1 text-yellow-700 font-bold">
                                                {pharmacy.rating}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mb-1">
                                        <MapPin size={14} color="#6B7280" />
                                        <Text className="ml-1 text-gray-600 text-sm" numberOfLines={1}>
                                            {pharmacy.address}
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center justify-between mt-3">
                                        <View className="flex-row items-center">
                                            <Clock size={14} color="#10B981" />
                                            <Text className="ml-1 text-green-600 text-sm font-medium">
                                                Open Now
                                            </Text>
                                        </View>
                                        <Text className="text-gray-600 text-sm">
                                            ${pharmacy.delivery_fee.toFixed(2)} delivery
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
                <View className="h-20" />
            </ScrollView>
        </View>
    );
}
