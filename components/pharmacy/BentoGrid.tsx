import { AlertTriangle, DollarSign, ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

export interface PharmacyStats {
    activeOrders: number;
    revenueToday: number;
    lowStockCount: number;
    totalProducts: number;
}

interface BentoGridProps {
    stats: PharmacyStats;
}

export const BentoGrid = ({ stats }: BentoGridProps) => {
    return (
        <View className="flex-row flex-wrap gap-3 mb-6">
            {/* Standard 2x2 Grid Layout */}

            {/* Card 1: Revenue (Large) */}
            <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <View className="bg-emerald-50 w-10 h-10 rounded-full items-center justify-center mb-3">
                    <DollarSign size={20} color="#059669" />
                </View>
                <Text className="text-gray-500 text-xs font-medium">Revenue Today</Text>
                <Text className="text-2xl font-bold text-gray-900 mt-1">${stats.revenueToday.toFixed(2)}</Text>
            </View>

            {/* Card 2: Active Orders (Large) */}
            <View className="w-[48%] bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <View className="bg-blue-50 w-10 h-10 rounded-full items-center justify-center mb-3">
                    <ShoppingBag size={20} color="#2563EB" />
                </View>
                <Text className="text-gray-500 text-xs font-medium">Active Orders</Text>
                <Text className="text-2xl font-bold text-gray-900 mt-1">{stats.activeOrders}</Text>
            </View>

            {/* Card 3: Low Stock (Wide) */}
            <View className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="bg-red-50 w-10 h-10 rounded-full items-center justify-center mr-3">
                        <AlertTriangle size={20} color="#DC2626" />
                    </View>
                    <View>
                        <Text className="text-gray-900 font-bold text-lg">{stats.lowStockCount} Items</Text>
                        <Text className="text-gray-500 text-xs">Low Stock Alert</Text>
                    </View>
                </View>
                {stats.lowStockCount > 0 && (
                    <View className="bg-red-100 px-3 py-1 rounded-full">
                        <Text className="text-red-700 text-xs font-bold">Action Needed</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
