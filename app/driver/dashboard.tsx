import { Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

interface Job {
    id: string;
    type: string;
    distance: string;
    earnings: number;
    status: 'available' | 'accepted';
}

export default function DriverDashboardScreen() {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(false);

    const jobs: Job[] = [
        { id: '1', type: 'Delivery', distance: '471 km', earnings: 10.00, status: 'available' },
        { id: '2', type: 'Delivery', distance: '241 km', earnings: 10.00, status: 'available' },
        { id: '3', type: 'Delivery', distance: '471 km', earnings: 10.00, status: 'available' },
        { id: '4', type: 'Pickup', distance: '241 km', earnings: 10.00, status: 'accepted' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white text-2xl font-bold">Driver Dashboard</Text>
                    </View>
                </View>

                {/* Online Toggle */}
                <Card className="bg-white/10 flex-row items-center justify-between p-4">
                    <Text className="text-white text-lg font-semibold">GO ONLINE</Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: '#FFFFFF40', true: '#10B981' }}
                        thumbColor={isOnline ? '#FFFFFF' : '#F3F4F6'}
                    />
                </Card>
            </View>

            {/* Job Feed */}
            <ScrollView className="flex-1 px-6 pt-6">
                <Text className="text-xl font-bold text-gray-800 mb-4">Job Feed</Text>

                {!isOnline && (
                    <Card className="items-center py-8 mb-4 bg-orange-50">
                        <Text className="text-orange-600 font-semibold mb-2">You're Offline</Text>
                        <Text className="text-gray-600 text-center">
                            Turn on "GO ONLINE" to start receiving job requests
                        </Text>
                    </Card>
                )}

                {jobs.map((job) => (
                    <TouchableOpacity
                        key={job.id}
                        onPress={() => router.push(`/driver/job-details?jobId=${job.id}` as any)}
                        className="mb-3"
                    >
                        <Card className="p-4">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-2">
                                        <MapPin size={16} color="#6B7280" />
                                        <Text className="ml-2 text-gray-700 font-medium">{job.type}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-sm">{job.distance}</Text>
                                </View>
                                <View className="items-end">
                                    <View className="flex-row items-center">
                                        <Text className="text-2xl font-bold text-primary mr-1">
                                            ${job.earnings.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-500 text-xs">Earning</Text>
                                </View>
                            </View>

                            {job.status === 'available' ? (
                                <TouchableOpacity
                                    className={`py-3 rounded-lg ${isOnline ? 'bg-secondary' : 'bg-gray-300'}`}
                                    disabled={!isOnline}
                                >
                                    <Text className="text-white text-center font-semibold">
                                        {isOnline ? 'Start to Accept' : 'Go Online to Accept'}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View className="flex-row">
                                    <TouchableOpacity className="flex-1 mr-2 bg-primary py-3 rounded-lg">
                                        <Text className="text-white text-center font-semibold">View Details</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 ml-2 bg-danger py-3 rounded-lg">
                                        <Text className="text-white text-center font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
