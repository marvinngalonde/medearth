import { Badge, Card } from '@/components/ui';
import { ordersService } from '@/services/ordersService';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Order {
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    pharmacies?: {
        name: string;
    };
    order_items?: Array<{
        product_name: string;
        quantity: number;
    }>;
}

export default function OrderHistoryScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, activeTab]);

    const fetchOrders = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await ordersService.getOrders(user.id);
            if (data) {
                // Typed casting since Supabase query might return slightly different structure, 
                // but ordersService.getOrders seems to return what we need. 
                // We'll map it to our Order interface if needed or rely on the query.
                // Assuming ordersService.getOrders returns enriched data.
                setOrders(data as any as Order[]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const activeOrders = orders.filter(
        (order) => ['pending', 'processing', 'in_transit', 'paid', 'pharmacy_accepted', 'ready_for_pickup'].includes(order.status)
    );

    const completedOrders = orders.filter(
        (order) => ['delivered', 'cancelled', 'completed'].includes(order.status)
    );

    const displayedOrders = activeTab === 'active' ? activeOrders : completedOrders;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'in_transit':
            case 'processing':
            case 'pharmacy_accepted':
                return 'info';
            case 'pending':
            case 'ready_for_pickup':
                return 'warning';
            case 'delivered':
            case 'completed':
            case 'paid':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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

            <ScrollView className="flex-1 px-6 pt-6">
                {loading ? (
                    <ActivityIndicator size="large" color="#1E3A8A" className="mt-8" />
                ) : displayedOrders.length === 0 ? (
                    <View className="items-center justify-center py-12">
                        <Package size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 text-lg mt-4">No orders found</Text>
                    </View>
                ) : (
                    displayedOrders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            onPress={() => router.push(`/tracking/${order.id}` as any)}
                            className="mb-4"
                        >
                            <Card>
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="text-sm text-gray-500 mb-1">
                                            {formatDate(order.created_at)}
                                        </Text>
                                        <Text className="font-bold text-gray-800 text-lg">
                                            {order.pharmacies?.name || 'Pharmacy'}
                                        </Text>
                                    </View>
                                    <Badge
                                        text={order.status.replace('_', ' ').toUpperCase()}
                                        variant={getStatusVariant(order.status)}
                                    />
                                </View>

                                <View className="border-t border-b border-gray-100 py-3 my-1">
                                    <Text className="text-gray-600">
                                        {order.order_items?.[0]?.product_name}
                                        {order.order_items && order.order_items.length > 1
                                            ? ` + ${order.order_items.length - 1} more`
                                            : ''}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mt-3">
                                    <Text className="font-bold text-lg text-primary">
                                        ${order.total.toFixed(2)}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <Text className="text-blue-500 font-medium mr-1">Track Order</Text>
                                        <Clock size={16} color="#3B82F6" />
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
