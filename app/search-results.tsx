import { Badge, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SearchResultsScreen() {
    const router = useRouter();
    const { query } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState<'medicines' | 'pharmacies'>('medicines');

    // Mock search results
    const medicineResults = [
        { id: '1', name: 'Paracetamol 500mg', pharmacy: 'Highland Pharmacy', price: 2.50, inStock: true },
        { id: '2', name: 'Paracetamol 1000mg', pharmacy: 'City Pharmacy', price: 3.00, inStock: true },
        { id: '3', name: 'Paracetamol Syrup', pharmacy: 'MedPlus', price: 4.50, inStock: false },
    ];

    const pharmacyResults = [
        { id: '1', name: 'Highland Family Pharmacy', rating: 4.5, deliveryFee: 2.50, distance: '1.2 km' },
        { id: '2', name: 'City Pharmacy', rating: 4.3, deliveryFee: 3.00, distance: '2.5 km' },
        { id: '3', name: 'MedPlus Pharmacy', rating: 4.7, deliveryFee: 2.00, distance: '0.8 km' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-4 px-6">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold flex-1">Search Results</Text>
                    <TouchableOpacity>
                        <SlidersHorizontal size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-800 flex-1">{query || 'Search...'}</Text>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-white border-b border-gray-200 px-6">
                <TouchableOpacity
                    onPress={() => setActiveTab('medicines')}
                    className={`flex-1 py-4 border-b-2 ${activeTab === 'medicines' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'medicines' ? 'text-primary' : 'text-gray-500'}`}>
                        Medicines ({medicineResults.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('pharmacies')}
                    className={`flex-1 py-4 border-b-2 ${activeTab === 'pharmacies' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'pharmacies' ? 'text-primary' : 'text-gray-500'}`}>
                        Pharmacies ({pharmacyResults.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
                {activeTab === 'medicines' ? (
                    <>
                        {medicineResults.map((medicine) => (
                            <TouchableOpacity
                                key={medicine.id}
                                onPress={() => router.push(`/product/${medicine.id}` as any)}
                                className="mb-3"
                            >
                                <Card className="p-4">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <Text className="font-bold text-gray-800 flex-1">{medicine.name}</Text>
                                        {medicine.inStock ? (
                                            <Badge text="In Stock" variant="success" />
                                        ) : (
                                            <Badge text="Out of Stock" variant="default" />
                                        )}
                                    </View>
                                    <Text className="text-gray-600 text-sm mb-2">{medicine.pharmacy}</Text>
                                    <Text className="text-primary font-bold text-lg">${medicine.price.toFixed(2)}</Text>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </>
                ) : (
                    <>
                        {pharmacyResults.map((pharmacy) => (
                            <TouchableOpacity
                                key={pharmacy.id}
                                onPress={() => router.push(`/pharmacy/${pharmacy.id}` as any)}
                                className="mb-3"
                            >
                                <Card className="p-4">
                                    <Text className="font-bold text-gray-800 mb-2">{pharmacy.name}</Text>
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-yellow-500 mr-1">⭐</Text>
                                        <Text className="font-semibold mr-3">{pharmacy.rating}</Text>
                                        <Text className="text-gray-600 text-sm">{pharmacy.distance}</Text>
                                    </View>
                                    <View className="flex-row justify-between">
                                        <Text className="text-gray-600">Delivery Fee</Text>
                                        <Text className="font-semibold text-primary">${pharmacy.deliveryFee.toFixed(2)}</Text>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
