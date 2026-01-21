import { SimpleMap } from '@/components/SimpleMap';
import { Badge, Button, Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, DollarSign, MapPin, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PharmacyDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Mock pharmacy data
    const pharmacy = {
        id: id as string,
        name: 'Highland Family Pharmacy',
        image: 'https://via.placeholder.com/400x200',
        rating: 4.5,
        reviews: 89,
        deliveryFee: 2.50,
        deliveryTime: '20-30 min',
        location: '123 Main Street, Harare',
        phone: '+263 123 456 789',
        hours: 'Open 8:00 AM - 10:00 PM',
        latitude: -17.8252,
        longitude: 31.0335,
        tags: ['Open Now', 'Fast Delivery', 'Verified'],
    };

    const products = [
        { id: '1', name: 'Paracetamol 500mg', price: 2.50, image: 'https://via.placeholder.com/80', inStock: true },
        { id: '2', name: 'Ibuprofen 400mg', price: 3.00, image: 'https://via.placeholder.com/80', inStock: true },
        { id: '3', name: 'Amoxicillin 250mg', price: 5.50, image: 'https://via.placeholder.com/80', inStock: false },
        { id: '4', name: 'Vitamin C 1000mg', price: 4.00, image: 'https://via.placeholder.com/80', inStock: true },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView>
                {/* Header Image */}
                <View className="relative">
                    <Image
                        source={{ uri: pharmacy.image }}
                        className="w-full h-48"
                    />
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-6 w-10 h-10 bg-white rounded-full items-center justify-center"
                        style={theme.shadows.md}
                    >
                        <ArrowLeft size={24} color="#1E3A8A" />
                    </TouchableOpacity>
                </View>

                <View className="px-6 pt-6">
                    {/* Pharmacy Info */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-800 mb-2">{pharmacy.name}</Text>
                        <View className="flex-row items-center mb-2">
                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                            <Text className="ml-1 font-semibold">{pharmacy.rating}</Text>
                            <Text className="text-gray-500 ml-1">({pharmacy.reviews} reviews)</Text>
                        </View>
                        <View className="flex-row flex-wrap">
                            {pharmacy.tags.map((tag, index) => (
                                <Badge key={index} text={tag} variant="success" className="mr-2 mb-2" />
                            ))}
                        </View>
                    </View>

                    {/* Quick Info */}
                    <Card className="mb-4">
                        <View className="flex-row justify-between mb-3">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <DollarSign size={16} color="#6B7280" />
                                    <Text className="ml-1 text-gray-600 text-sm">Delivery Fee</Text>
                                </View>
                                <Text className="font-bold text-gray-800">${pharmacy.deliveryFee.toFixed(2)}</Text>
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <Clock size={16} color="#6B7280" />
                                    <Text className="ml-1 text-gray-600 text-sm">Delivery Time</Text>
                                </View>
                                <Text className="font-bold text-gray-800">{pharmacy.deliveryTime}</Text>
                            </View>
                        </View>
                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row items-center mb-1">
                                <Clock size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-700">{pharmacy.hours}</Text>
                            </View>
                            <View className="flex-row items-center">
                                <MapPin size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-700 flex-1">{pharmacy.location}</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Map */}
                    <Text className="text-lg font-bold text-gray-800 mb-3">Location</Text>
                    <View className="mb-4">
                        <SimpleMap
                            latitude={pharmacy.latitude}
                            longitude={pharmacy.longitude}
                            zoom={15}
                            height={200}
                            markers={[{ latitude: pharmacy.latitude, longitude: pharmacy.longitude, color: 'red' }]}
                        />
                    </View>

                    {/* Products */}
                    <Text className="text-lg font-bold text-gray-800 mb-3">Popular Products</Text>
                    {products.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            onPress={() => router.push(`/product/${product.id}` as any)}
                            className="mb-3"
                        >
                            <Card className="flex-row items-center">
                                <Image
                                    source={{ uri: product.image }}
                                    className="w-16 h-16 rounded-lg"
                                />
                                <View className="flex-1 ml-4">
                                    <Text className="font-bold text-gray-800">{product.name}</Text>
                                    <Text className="text-primary font-semibold mt-1">${product.price.toFixed(2)}</Text>
                                </View>
                                {product.inStock ? (
                                    <Badge text="In Stock" variant="success" />
                                ) : (
                                    <Badge text="Out of Stock" variant="default" />
                                )}
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Call Button */}
            <View className="p-6 border-t border-gray-200 bg-white">
                <Button
                    title={`Call ${pharmacy.name}`}
                    onPress={() => {
                        // TODO: Implement phone call
                    }}
                />
            </View>
        </View>
    );
}
