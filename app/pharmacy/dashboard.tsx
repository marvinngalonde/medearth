import { BentoGrid } from '@/components/pharmacy/BentoGrid';
import { InventoryRow } from '@/components/pharmacy/InventoryRow';
import { OrdersKanban } from '@/components/pharmacy/OrdersKanban';
import { usePharmacyInventory } from '@/hooks/usePharmacyInventory';
import { usePharmacyOrders } from '@/hooks/usePharmacyOrders';
import { usePharmacyStats } from '@/hooks/usePharmacyStats';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Package, Plus } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PharmacyDashboardScreen() {
    const router = useRouter();

    // Data Hooks
    const { stats, loading: statsLoading, refresh: refreshStats } = usePharmacyStats();
    const { orders, loading: ordersLoading, updateOrderStatus, refresh: refreshOrders } = usePharmacyOrders();
    const { products, loading: productsLoading, toggleProductStatus, refresh: refreshInventory } = usePharmacyInventory();

    const loading = statsLoading || ordersLoading || productsLoading;

    const onRefresh = React.useCallback(() => {
        refreshStats();
        refreshOrders();
        refreshInventory();
    }, []);

    // Helper for editing product (placeholder for now)
    const handleEditProduct = (id: string) => {
        router.push(`/pharmacy/products?id=${id}` as any);
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6 shadow-md z-10">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold flex-1">Pharmacy Dashboard</Text>
                    <View className="bg-white px-3 py-1 rounded-full">
                        <Text className="text-primary font-bold text-xs uppercase">Business Mode</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <TouchableOpacity
                    onPress={() => router.push('/pharmacy/products' as any)}
                    className="bg-white rounded-lg px-4 py-3 flex-row items-center justify-between shadow-sm active:bg-gray-100"
                >
                    <View className="flex-row items-center">
                        <Package size={20} color="#1E3A8A" />
                        <Text className="ml-2 text-primary font-semibold">Manage Inventory</Text>
                    </View>
                    <View className="bg-blue-50 p-1 rounded-full">
                        <Plus size={16} color="#1E3A8A" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
            >
                <View className="p-6">
                    {/* 1. Bento Grid Stats */}
                    <BentoGrid stats={stats} />

                    {/* 2. Kanban Board */}
                    <View className="mb-8">
                        <OrdersKanban orders={orders} onMoveOrder={updateOrderStatus} />
                    </View>

                    {/* 3. Quick Inventory Check (Low Stock or Top Items) */}
                    <Text className="text-lg font-bold text-gray-800 mb-3 px-1">Quick Inventory</Text>
                    {products.slice(0, 5).map((product) => (
                        <InventoryRow
                            key={product.id}
                            product={product}
                            onToggleStatus={toggleProductStatus}
                            onEdit={handleEditProduct}
                        />
                    ))}
                    {products.length === 0 && !loading && (
                        <View className="p-6 bg-white rounded-xl items-center border border-dashed border-gray-300">
                            <Text className="text-gray-400">No products found</Text>
                            <TouchableOpacity onPress={() => router.push('/pharmacy/products' as any)}>
                                <Text className="text-primary font-bold mt-2">Add Your First Product</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {loading && !stats && (
                <View className="absolute inset-0 bg-white/80 items-center justify-center z-20">
                    <ActivityIndicator size="large" color="#1E3A8A" />
                </View>
            )}
        </View>
    );
}
