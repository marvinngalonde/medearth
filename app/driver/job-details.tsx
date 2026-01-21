import { SimpleMap } from '@/components/SimpleMap';
import { Badge, Button, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Package, Phone } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DriverJobDetailsScreen() {
    const router = useRouter();
    const { jobId } = useLocalSearchParams();

    // Mock job data
    const job = {
        id: jobId as string || 'JOB-001',
        type: 'Delivery',
        status: 'available', // available, accepted, in_progress, completed
        orderId: 'ORD-12345',
        customerName: 'John Doe',
        customerPhone: '+263 123 456 789',
        pharmacyName: 'Highland Pharmacy',
        pharmacyAddress: '123 Main Street, Harare',
        pharmacyLat: -17.8252,
        pharmacyLng: 31.0335,
        deliveryAddress: '456 Customer Ave, Harare',
        deliveryLat: -17.8272,
        deliveryLng: 31.0355,
        distance: '2.5 km',
        earnings: 5.00,
        items: 2,
        estimatedTime: '25 min',
    };

    const handleAcceptJob = () => {
        // TODO: Accept job and update status
        router.back();
    };

    const handleStartDelivery = () => {
        router.push(`/tracking/${job.orderId}` as any);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-xl font-bold">Job Details</Text>
                        <Text className="text-blue-200">{job.type} - {job.id}</Text>
                    </View>
                    <Badge
                        text={job.status === 'available' ? 'Available' : 'In Progress'}
                        variant={job.status === 'available' ? 'success' : 'info'}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Earnings */}
                <Card className="mb-4 bg-secondary">
                    <View className="items-center py-4">
                        <Text className="text-white text-sm mb-1">You'll Earn</Text>
                        <Text className="text-white text-3xl font-bold">${job.earnings.toFixed(2)}</Text>
                        <Text className="text-green-100 text-sm mt-1">{job.distance} • {job.estimatedTime}</Text>
                    </View>
                </Card>

                {/* Map */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Route</Text>
                <View className="mb-4">
                    <SimpleMap
                        latitude={(job.pharmacyLat + job.deliveryLat) / 2}
                        longitude={(job.pharmacyLng + job.deliveryLng) / 2}
                        zoom={13}
                        height={200}
                        markers={[
                            { latitude: job.pharmacyLat, longitude: job.pharmacyLng, color: 'green' },
                            { latitude: job.deliveryLat, longitude: job.deliveryLng, color: 'red' },
                        ]}
                    />
                </View>

                {/* Pickup Location */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Pickup</Text>
                <Card className="mb-4">
                    <View className="flex-row items-start mb-3">
                        <View className="w-10 h-10 bg-secondary rounded-full items-center justify-center mr-3">
                            <Package size={20} color="#FFFFFF" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 mb-1">{job.pharmacyName}</Text>
                            <Text className="text-gray-600 text-sm">{job.pharmacyAddress}</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center">
                        <Package size={16} color="#6B7280" />
                        <Text className="ml-2 text-gray-700">{job.items} item(s)</Text>
                    </View>
                </Card>

                {/* Delivery Location */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Delivery</Text>
                <Card className="mb-4">
                    <View className="flex-row items-start mb-3">
                        <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-3">
                            <MapPin size={20} color="#FFFFFF" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-gray-800 mb-1">{job.customerName}</Text>
                            <Text className="text-gray-600 text-sm">{job.deliveryAddress}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="flex-row items-center">
                        <Phone size={16} color="#1E3A8A" />
                        <Text className="ml-2 text-primary font-semibold">{job.customerPhone}</Text>
                    </TouchableOpacity>
                </Card>

                {/* Job Summary */}
                <Card className="mb-6">
                    <Text className="font-bold text-gray-800 mb-3">Summary</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Distance</Text>
                        <Text className="font-semibold text-gray-800">{job.distance}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Estimated Time</Text>
                        <Text className="font-semibold text-gray-800">{job.estimatedTime}</Text>
                    </View>
                    <View className="border-t border-gray-200 pt-2 mt-2 flex-row justify-between">
                        <Text className="font-bold text-lg">Earnings</Text>
                        <Text className="font-bold text-lg text-secondary">${job.earnings.toFixed(2)}</Text>
                    </View>
                </Card>
            </ScrollView>

            {/* Action Buttons */}
            <View className="p-6 border-t border-gray-200 bg-white">
                {job.status === 'available' ? (
                    <Button
                        title="Accept Job"
                        onPress={handleAcceptJob}
                    />
                ) : (
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <Button
                                title="Navigate"
                                onPress={() => { }}
                                variant="outline"
                            />
                        </View>
                        <View className="flex-1 ml-2">
                            <Button
                                title="Start Delivery"
                                onPress={handleStartDelivery}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
