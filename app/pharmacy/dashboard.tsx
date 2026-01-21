import { Badge, Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Order {
    id: string;
    customer: string;
    items: number;
    time: string;
    status: 'new' | 'packing' | 'ready';
}

export default function PharmacyDashboardScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'new' | 'packing' | 'ready'>('new');

    const orders: Order[] = [
        { id: '1', customer: '1 Isami Kaoru', items: 1, time: '3 hours ago', status: 'new' },
        { id: '2', customer: '2 Isami Kaoru', items: 2, time: '3 hours ago', status: 'new' },
        { id: '3', customer: '3 Isami Kaoru', items: 1, time: '3 hours ago', status: 'new' },
        { id: '4', customer: '1 Isami Kaoru', items: 1, time: '3 hours ago', status: 'packing' },
        { id: '5', customer: '2 Isami Kaoru', items: 3, time: '3 hours ago', status: 'packing' },
        { id: '6', customer: '1 Isami Kaoru', items: 1, time: '3 hours ago', status: 'ready' },
    ];

    const getOrdersByStatus = (status: 'new' | 'packing' | 'ready') => {
        return orders.filter(order => order.status === status);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'danger';
            case 'packing': return 'warning';
            case 'ready': return 'success';
            default: return 'default';
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
                    <Text className="text-white text-2xl font-bold flex-1">Pharmacy Dashboard</Text>
                    <View className="bg-white px-3 py-1 rounded-full">
                        <Text className="text-primary font-bold">Business Mode</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <TouchableOpacity
                    onPress={() => router.push('/pharmacy/products' as any)}
                    className="bg-white rounded-lg px-4 py-3 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center">
                        <Package size={20} color="#1E3A8A" />
                        <Text className="ml-2 text-primary font-semibold">Manage Products</Text>
                    </View>
                    <Text className="text-gray-400">›</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-white px-6 py-2 border-b border-gray-200">
                {[
                    { id: 'new', label: 'New Orders', count: getOrdersByStatus('new').length },
                    { id: 'packing', label: 'Packing', count: getOrdersByStatus('packing').length },
                    { id: 'ready', label: 'Ready', count: getOrdersByStatus('ready').length },
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 border-b-2 ${activeTab === tab.id ? 'border-secondary' : 'border-transparent'
                            }`}
                    >
                        <View className="items-center">
                            <Text className={`font-semibold ${activeTab === tab.id ? 'text-secondary' : 'text-gray-500'
                                }`}>
                                {tab.label}
                            </Text>
                            {tab.count > 0 && (
                                <Badge
                                    text={tab.count.toString()}
                                    variant={getStatusColor(tab.id) as any}
                                    className="mt-1"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Orders List */}
            <ScrollView className="flex-1 px-6 pt-4">
                {getOrdersByStatus(activeTab).map((order) => (
                    <Card key={order.id} className="mb-3">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                                    <Package size={20} color="#FFFFFF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-gray-800">{order.customer}</Text>
                                    <Text className="text-gray-500 text-sm">
                                        {order.items} item{order.items > 1 ? 's' : ''}
                                    </Text>
                                </View>
                            </View>
                            <Badge text={order.status.toUpperCase()} variant={getStatusColor(order.status) as any} />
                        </View>
                        <Text className="text-gray-400 text-xs">{order.time}</Text>

                        {activeTab === 'new' && (
                            <TouchableOpacity className="mt-3 bg-secondary py-2 rounded-lg">
                                <Text className="text-white text-center font-semibold">Request Driver</Text>
                            </TouchableOpacity>
                        )}
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}
