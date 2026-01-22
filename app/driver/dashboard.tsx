import { ActiveDeliveryMap } from '@/components/driver/ActiveDeliveryMap';
import { DriverStatusCard } from '@/components/driver/DriverStatusCard';
import { JobRequestModal } from '@/components/driver/JobRequestModal';
import { useDriverState } from '@/hooks/useDriverState';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, History, Map, Truck } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DriverDashboardScreen() {
    const router = useRouter();
    const {
        isOnline,
        toggleOnline,
        activeJob,
        incomingJob,
        acceptJob,
        declineJob,
        completeJob,
        stats
    } = useDriverState();

    return (
        <View className="flex-1 bg-gray-900">
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View className="bg-gray-800 pt-12 pb-6 px-6 z-10 border-b border-gray-700">
                <View className="flex-row items-center mb-1">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold flex-1">Logistics Hub</Text>
                    <View className="bg-blue-500 px-3 py-1 rounded-full">
                        <Text className="text-white font-bold text-xs uppercase">Driver</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* 1. Status Card */}
                <DriverStatusCard
                    isOnline={isOnline}
                    onToggle={toggleOnline}
                    stats={stats}
                />

                {/* 2. Main Content Area */}
                {isOnline ? (
                    <View>
                        {activeJob ? (
                            <View>
                                <Text className="text-gray-400 font-bold mb-3 uppercase tracking-wider">Current Delivery</Text>
                                <ActiveDeliveryMap />

                                <View className="bg-gray-800 p-4 rounded-xl mb-6">
                                    <View className="flex-row justify-between mb-2">
                                        <Text className="text-gray-400">Destination</Text>
                                        <Text className="text-white font-bold">{activeJob.distance}</Text>
                                    </View>
                                    <Text className="text-white text-lg font-semibold mb-4">{activeJob.deliveryAddress}</Text>

                                    <TouchableOpacity
                                        onPress={completeJob}
                                        className="bg-green-500 py-3 rounded-lg items-center"
                                    >
                                        <Text className="text-white font-bold">Complete Delivery</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View className="items-center justify-center py-10 bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-700">
                                <View className="w-20 h-20 bg-blue-500/20 rounded-full items-center justify-center mb-4 animate-pulse">
                                    <Map size={32} color="#3B82F6" />
                                </View>
                                <Text className="text-white text-xl font-bold">Finding Orders...</Text>
                                <Text className="text-gray-400 mt-2 text-center px-8">Stay in high demand areas for better matches.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        <Text className="text-gray-400 font-bold mb-3 uppercase tracking-wider">Recent Activity</Text>
                        <View className="bg-gray-800 rounded-xl p-4 mb-4">
                            <View className="flex-row items-center justify-between mb-4 border-b border-gray-700 pb-4">
                                <View className="flex-row items-center">
                                    <History size={20} color="#9CA3AF" />
                                    <Text className="text-gray-300 ml-3 font-medium">Last Session</Text>
                                </View>
                                <Text className="text-white font-bold">Yesterday</Text>
                            </View>
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <Truck size={20} color="#9CA3AF" />
                                    <Text className="text-gray-300 ml-3 font-medium">Total Deliveries</Text>
                                </View>
                                <Text className="text-white font-bold">12</Text>
                            </View>
                        </View>

                        <View className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                            <Text className="text-blue-400 font-bold mb-1">Pro Tip</Text>
                            <Text className="text-blue-200 text-sm">Peak hours start at 5 PM. Go online then to earn 1.5x more.</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Incoming Job Modal */}
            <JobRequestModal
                visible={!!incomingJob}
                job={incomingJob}
                onAccept={acceptJob}
                onDecline={declineJob}
            />
        </View>
    );
}
