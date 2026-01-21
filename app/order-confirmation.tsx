import { Badge, Button, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Clock, MapPin, Package } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function OrderConfirmationScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams();

    // Mock order data
    const order = {
        id: orderId as string || 'ORD-12345',
        status: 'confirmed',
        estimatedTime: '25-35 minutes',
        deliveryAddress: '123 Main Street, Harare',
        items: [
            { name: 'Paracetamol 500mg', quantity: 2, price: 5.00 },
            { name: 'Vitamin C 1000mg', quantity: 1, price: 4.00 },
        ],
        subtotal: 9.00,
        deliveryFee: 2.50,
        total: 11.50,
        paymentMethod: 'Cash on Delivery',
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-6 pt-12">
                {/* Success Icon */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 bg-secondary rounded-full items-center justify-center mb-4">
                        <CheckCircle size={48} color="#FFFFFF" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</Text>
                    <Text className="text-gray-600 text-center">
                        Your order has been placed successfully
                    </Text>
                </View>

                {/* Order Details */}
                <Card className="mb-4">
                    <Text className="font-bold text-gray-800 mb-3">Order Details</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Order ID</Text>
                        <Text className="font-semibold text-gray-800">{order.id}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Status</Text>
                        <Badge text="Confirmed" variant="success" />
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-600">Payment Method</Text>
                        <Text className="font-semibold text-gray-800">{order.paymentMethod}</Text>
                    </View>
                </Card>

                {/* Delivery Info */}
                <Card className="mb-4">
                    <View className="flex-row items-center mb-3">
                        <Clock size={20} color="#1E3A8A" />
                        <Text className="ml-2 font-bold text-gray-800">Estimated Delivery</Text>
                    </View>
                    <Text className="text-gray-700 mb-4">{order.estimatedTime}</Text>

                    <View className="flex-row items-start">
                        <MapPin size={20} color="#1E3A8A" />
                        <View className="ml-2 flex-1">
                            <Text className="font-bold text-gray-800 mb-1">Delivery Address</Text>
                            <Text className="text-gray-700">{order.deliveryAddress}</Text>
                        </View>
                    </View>
                </Card>

                {/* Items */}
                <Card className="mb-4">
                    <View className="flex-row items-center mb-3">
                        <Package size={20} color="#1E3A8A" />
                        <Text className="ml-2 font-bold text-gray-800">Order Items</Text>
                    </View>
                    {order.items.map((item, index) => (
                        <View key={index} className="flex-row justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <View className="flex-1">
                                <Text className="text-gray-800">{item.name}</Text>
                                <Text className="text-gray-500 text-sm">Qty: {item.quantity}</Text>
                            </View>
                            <Text className="font-semibold text-gray-800">${item.price.toFixed(2)}</Text>
                        </View>
                    ))}
                </Card>

                {/* Order Summary */}
                <Card className="mb-6">
                    <Text className="font-bold text-gray-800 mb-3">Order Summary</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Subtotal</Text>
                        <Text className="font-semibold">${order.subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Delivery Fee</Text>
                        <Text className="font-semibold">${order.deliveryFee.toFixed(2)}</Text>
                    </View>
                    <View className="border-t border-gray-200 pt-2 mt-2 flex-row justify-between">
                        <Text className="font-bold text-lg">Total</Text>
                        <Text className="font-bold text-lg text-primary">${order.total.toFixed(2)}</Text>
                    </View>
                </Card>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-6 border-t border-gray-200 bg-white">
                <Button
                    title="Track Order"
                    onPress={() => router.push(`/tracking/${order.id}` as any)}
                    className="mb-3"
                />
                <Button
                    title="Back to Home"
                    onPress={() => router.push('/(tabs)/')}
                    variant="outline"
                />
            </View>
        </View>
    );
}
