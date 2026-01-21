import { Badge, Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OrderHistoryScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    const activeOrders = [
        {
            id: 'ORD-12345',
            date: '2026-01-21',
            status: 'In Transit',
            items: 2,
            total: 11.50,
            pharmacy: 'Highland Pharmacy',
        },
        {
            id: 'ORD-12344',
            date: '2026-01-20',
            status: 'Packing',
            items: 1,
            total: 5.00,
            pharmacy: 'City Pharmacy',
        },
    ];

    const completedOrders = [
        {
            id: 'ORD-12343',
            date: '2026-01-18',
            status: 'Delivered',
            items: 3,
            total: 15.00,
            pharmacy: 'MedPlus',
        },
        {
            id: 'ORD-12342',
            date: '2026-01-15',
            status: 'Delivered',
            items: 1,
            total: 4.00,
            pharmacy: 'Highland Pharmacy',
        },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'In Transit':
                return 'info';
            case 'Packing':
                return 'warning';
            case 'Delivered':
                return 'success';
            default:
                return 'default';
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Order History</Text>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-white border-b border-gray-200 px-6">
                <TouchableOpacity
                    onPress={() => setActiveTab('active')}
                    className={`flex-1 py-4 border-b-2 ${activeTab === 'active' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'active' ? 'text-primary' : 'text-gray-500'}`}>
                        Active ({activeOrders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('completed')}
                    className={`flex-1 py-4 border-b-2 ${activeTab === 'completed' ? 'border-primary' : 'border-transparent'}`}
                >
                    <Text className={`text-center font-semibold ${activeTab === 'completed' ? 'text-primary' : 'text-gray-500'}`}>
                        Completed ({completedOrders.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-4">
                {(activeTab === 'active' ? activeOrders : completedOrders).map((order) => (
                    <TouchableOpacity
                        key={order.id}
                        onPress={() => {
                            if (activeTab === 'active') {
                                router.push(`/tracking/${order.id}` as any);
                            }
                        }}
                        className="mb-3"
                    >
                        <Card className="p-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <Text className="font-bold text-gray-800 mb-1">{order.id}</Text>
                                    <Text className="text-gray-600 text-sm">{order.pharmacy}</Text>
                                </View>
                                <Badge text={order.status} variant={getStatusVariant(order.status) as any} />
                            </View>

                            <View className="flex-row items-center mb-2">
                                <Clock size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-600 text-sm">{order.date}</Text>
                            </View>

                            <View className="flex-row items-center mb-3">
                                <Package size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-600 text-sm">{order.items} item(s)</Text>
                            </View>

                            <View className="border-t border-gray-200 pt-3 flex-row justify-between items-center">
                                <Text className="text-gray-600">Total</Text>
                                <Text className="font-bold text-primary text-lg">${order.total.toFixed(2)}</Text>
                            </View>

                            {activeTab === 'completed' && (
                                <TouchableOpacity className="mt-3">
                                    <View className="bg-primary rounded-lg py-2 items-center">
                                        <Text className="text-white font-semibold">Reorder</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
