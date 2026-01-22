import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

// In a real implementation this would use react-native-maps
export const ActiveDeliveryMap = () => {
    return (
        <View className="flex-1 bg-gray-800 relative rounded-xl overflow-hidden mb-6 min-h-[200px]">
            {/* Placeholder Map Background */}
            <View className="absolute inset-0 bg-gray-700 items-center justify-center">
                <View className="w-full h-1 bg-gray-600 absolute top-1/2" />
                <View className="h-full w-1 bg-gray-600 absolute left-1/2" />
                <Text className="text-gray-500 font-bold text-xl opacity-20 transform -rotate-45">MAP VIEW</Text>
            </View>

            {/* Markers */}
            <View className="absolute top-1/4 left-1/4 items-center">
                <View className="bg-blue-500 w-8 h-8 rounded-full items-center justify-center shadow-lg border-2 border-white">
                    <View className="w-3 h-3 bg-white rounded-full" />
                </View>
                <View className="bg-white px-2 py-1 rounded mt-1 shadow-sm">
                    <Text className="text-xs font-bold text-gray-800">CVS Pharmacy</Text>
                </View>
            </View>

            <View className="absolute bottom-1/3 right-1/4 items-center">
                <View className="bg-green-500 w-8 h-8 rounded-full items-center justify-center shadow-lg border-2 border-white">
                    <MapPin size={16} color="white" />
                </View>
                <View className="bg-white px-2 py-1 rounded mt-1 shadow-sm">
                    <Text className="text-xs font-bold text-gray-800">Customer</Text>
                </View>
            </View>

            {/* Simulated Route Line (SVG would be better here) */}
            <View className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-xl z-10" />
        </View>
    );
};
