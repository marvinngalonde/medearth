import { SimpleMap } from '@/components/SimpleMap';
import { Badge, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, Phone, X } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function OrderTrackingScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Mock order data
    const order = {
        id: id as string,
        status: 'In Transit',
        driver: {
            name: 'Blessing',
            phone: 'Bike: CDE 0451',
            rating: 4.8,
            image: 'https://via.placeholder.com/100',
        },
    };

    return (
        <View className="flex-1 bg-white">
            {/* Close Button */}
            <TouchableOpacity
                onPress={() => router.back()}
                className="absolute top-12 right-6 z-10 w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
            >
                <X size={24} color="#1E3A8A" />
            </TouchableOpacity>

            {/* Map */}
            <View className="flex-1">
                <SimpleMap
                    latitude={-17.8262}
                    longitude={31.0345}
                    zoom={14}
                    height="100%"
                    markers={[
                        { latitude: -17.8252, longitude: 31.0335, color: 'green' },
                        { latitude: -17.8262, longitude: 31.0345, color: 'blue' },
                        { latitude: -17.8272, longitude: 31.0355, color: 'red' },
                    ]}
                />
            </View>

            {/* Driver Info Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

                <View className="flex-row items-center mb-4">
                    <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                        <Text className="text-white text-2xl">🏍️</Text>
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-xl font-bold text-gray-800">{order.driver.name}</Text>
                        <Text className="text-gray-500">{order.driver.phone}</Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-yellow-500 mr-1">⭐</Text>
                            <Text className="text-gray-600">{order.driver.rating}</Text>
                        </View>
                    </View>
                    <Badge text={order.status} variant="info" />
                </View>

                {/* Action Buttons */}
                <View className="flex-row">
                    <TouchableOpacity className="flex-1 mr-2">
                        <Card className="bg-primary flex-row items-center justify-center py-4">
                            <Phone size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-white font-semibold">Call</Text>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 ml-2">
                        <Card className="bg-secondary flex-row items-center justify-center py-4">
                            <MessageCircle size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-white font-semibold">Message</Text>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
