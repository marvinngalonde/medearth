import { Badge } from '@/components/ui';
import { Package } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export interface KanbanOrder {
    id: string;
    order_number: string;
    status: 'pending' | 'confirmed' | 'packing' | 'ready' | 'delivered' | 'cancelled';
    customer_name: string;
    items_count: number;
    time_ago: string;
}

interface OrdersKanbanProps {
    orders: KanbanOrder[];
    onMoveOrder: (orderId: string, newStatus: string) => void;
}

export const OrdersKanban = ({ orders, onMoveOrder }: OrdersKanbanProps) => {
    const columns = [
        { id: 'new', label: 'New', statuses: ['pending', 'confirmed'], color: 'border-blue-200 bg-blue-50' },
        { id: 'packing', label: 'Packing', statuses: ['packing'], color: 'border-yellow-200 bg-yellow-50' },
        { id: 'ready', label: 'Ready', statuses: ['ready'], color: 'border-green-200 bg-green-50' },
    ];

    const getOrdersForColumn = (statuses: string[]) => {
        return orders.filter((o) => statuses.includes(o.status));
    };

    return (
        <View className="h-64">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">Orders Board</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                {columns.map((col) => (
                    <View key={col.id} className="w-64 mr-3">
                        <View className={`p-3 rounded-t-xl border-b-2 flex-row justify-between items-center ${col.color.replace('bg-', 'bg-opacity-50 ')} border-gray-200`}>
                            <Text className="font-bold text-gray-700">{col.label}</Text>
                            <View className="bg-white px-2 py-0.5 rounded-full">
                                <Text className="text-xs font-bold text-gray-600">{getOrdersForColumn(col.statuses).length}</Text>
                            </View>
                        </View>

                        <ScrollView className="bg-gray-100 rounded-b-xl p-2 h-full">
                            {getOrdersForColumn(col.statuses).map((order) => (
                                <View key={order.id} className="bg-white p-3 rounded-lg mb-2 shadow-sm border border-gray-200">
                                    <View className="flex-row justify-between mb-1">
                                        <Text className="font-bold text-gray-800 text-sm">{order.order_number}</Text>
                                        <Text className="text-xs text-gray-500">{order.time_ago}</Text>
                                    </View>
                                    <Text className="text-gray-600 text-xs mb-2">{order.customer_name}</Text>
                                    <View className="flex-row justify-between items-center">
                                        <Badge text={`${order.items_count} items`} variant="default" />

                                        {/* Action Button */}
                                        {col.id === 'new' && (
                                            <TouchableOpacity onPress={() => onMoveOrder(order.id, 'packing')} className="bg-blue-500 px-2 py-1 rounded">
                                                <Text className="text-white text-[10px] font-bold">Pack</Text>
                                            </TouchableOpacity>
                                        )}
                                        {col.id === 'packing' && (
                                            <TouchableOpacity onPress={() => onMoveOrder(order.id, 'ready')} className="bg-yellow-500 px-2 py-1 rounded">
                                                <Text className="text-white text-[10px] font-bold">Ready</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                            {getOrdersForColumn(col.statuses).length === 0 && (
                                <View className="items-center py-6 opactiy-50">
                                    <Package size={24} color="#D1D5DB" />
                                    <Text className="text-gray-400 text-xs mt-1">Empty</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};
