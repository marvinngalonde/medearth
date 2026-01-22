import { MapPin, Navigation, X } from 'lucide-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export interface JobRequest {
    id: string;
    pharmacyName: string;
    pharmacyAddress: string;
    deliveryAddress: string;
    distance: string;
    earnings: number;
    itemsCount: number;
}

interface JobRequestModalProps {
    visible: boolean;
    job: JobRequest | null;
    onAccept: () => void;
    onDecline: () => void;
}

export const JobRequestModal = ({ visible, job, onAccept, onDecline }: JobRequestModalProps) => {
    if (!job) return null;

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View className="flex-1 bg-black/60 justify-end">
                <View className="bg-gray-900 rounded-t-3xl p-6 min-h-[50%]">
                    {/* Header */}
                    <View className="items-center mb-6">
                        <View className="w-12 h-1 bg-gray-700 rounded-full mb-4" />
                        <Text className="text-green-400 font-bold text-lg uppercase tracking-wider">New Delivery Request</Text>
                        <Text className="text-white text-4xl font-bold mt-2">${job.earnings.toFixed(2)}</Text>
                        <Text className="text-gray-400 text-sm mt-1">Estimated Earnings</Text>
                    </View>

                    {/* Route Info */}
                    <View className="bg-gray-800 rounded-2xl p-4 mb-8">
                        {/* Pickup */}
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 rounded-full bg-blue-500/20 items-center justify-center mr-3">
                                <View className="w-3 h-3 rounded-full bg-blue-500" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs uppercase mb-1">Pickup</Text>
                                <Text className="text-white font-bold text-base">{job.pharmacyName}</Text>
                                <Text className="text-gray-500 text-sm" numberOfLines={1}>{job.pharmacyAddress}</Text>
                            </View>
                        </View>

                        {/* Dropoff */}
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center mr-3">
                                <MapPin size={16} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-400 text-xs uppercase mb-1">Dropoff</Text>
                                <Text className="text-white font-bold text-base">{job.distance} away</Text>
                                <Text className="text-gray-500 text-sm" numberOfLines={1}>{job.deliveryAddress}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Actions */}
                    <View className="flex-row justify-between gap-4 mt-auto mb-4">
                        <TouchableOpacity
                            onPress={onDecline}
                            className="flex-1 bg-gray-800 py-4 rounded-full items-center active:bg-gray-700"
                        >
                            <X size={24} color="#EF4444" />
                            <Text className="text-red-500 font-bold mt-1">Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onAccept}
                            className="flex-1 bg-green-500 py-4 rounded-full items-center shadow-lg shadow-green-900/20 active:bg-green-600"
                        >
                            <Navigation size={24} color="#FFFFFF" />
                            <Text className="text-white font-bold mt-1">Accept Job</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
