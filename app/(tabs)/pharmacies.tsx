import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/constants/theme';
import { usePharmacies } from '@/hooks/usePharmacies';
import { useRouter } from 'expo-router';
import { Clock, MapPin, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

interface Pharmacy {
    id: string;
    name: string;
    address: string;
    rating: number;
    image_url: string;
    is_open: boolean;
    delivery_fee: number;
    delivery_time: string;
}

export default function PharmaciesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { pharmacies, loading, refresh } = usePharmacies();

    const filteredPharmacies = pharmacies.filter((pharmacy) =>
        pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderPharmacy = ({ item }: { item: Pharmacy }) => (
        <TouchableOpacity
            className="bg-white rounded-xl mb-4 overflow-hidden border border-gray-100 shadow-sm"
            style={theme.shadows.sm}
            onPress={() => router.push(`/pharmacy/${item.id}`)}
        >
            <View className="h-40 relative">
                <Image
                    source={{ uri: item.image_url }}
                    className="w-full h-full bg-gray-200"
                    resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex-row items-center">
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <Text className="ml-1 text-xs font-bold">{item.rating}</Text>
                </View>
                {!item.is_open && (
                    <View className="absolute inset-0 bg-black/40 items-center justify-center">
                        <Text className="text-white font-bold text-lg">CLOSED</Text>
                    </View>
                )}
            </View>

            <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">{item.name}</Text>
                    {item.delivery_fee === 0 ? (
                        <Text className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">Free Delivery</Text>
                    ) : (
                        <Text className="text-gray-500 text-xs font-medium">${item.delivery_fee.toFixed(2)} Delivery</Text>
                    )}
                </View>

                <View className="flex-row items-center mb-1">
                    <MapPin size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-sm ml-1 flex-1" numberOfLines={1}>{item.address}</Text>
                </View>

                <View className="flex-row items-center mt-2 pt-2 border-t border-gray-50">
                    <Clock size={14} color="#6B7280" />
                    <Text className="text-gray-500 text-xs ml-1">{item.delivery_time}</Text>
                    <Text className="text-gray-300 mx-2">•</Text>
                    <Text className={item.is_open ? "text-green-600 text-xs font-bold" : "text-red-500 text-xs font-bold"}>
                        {item.is_open ? "Open Now" : "Closed"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <ScreenHeader
                title="Pharmacies"
                subtitle="Order Medicine & Supplies"
                searchPlaceholder="Search pharmacies..."
                onSearch={setSearchQuery}
            />

            <FlatList
                data={filteredPharmacies}
                renderItem={renderPharmacy}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                refreshing={loading}
                onRefresh={refresh}
                ListEmptyComponent={() => (
                    <View className="p-10 items-center">
                        <Text className="text-gray-400 text-center">No pharmacies found matching your criteria.</Text>
                    </View>
                )}
            />
        </View>
    );
}
