import { Clock, MapPin } from 'lucide-react-native';
import React from 'react';
import { Switch, Text, View } from 'react-native';

interface DriverStatusCardProps {
    isOnline: boolean;
    onToggle: (value: boolean) => void;
    stats: {
        timeOnline: string;
        tripsCompleted: number;
        earnings: number;
    };
}

export const DriverStatusCard = ({ isOnline, onToggle, stats }: DriverStatusCardProps) => {
    return (
        <View className={`rounded-3xl p-6 mb-6 ${isOnline ? 'bg-gray-900' : 'bg-gray-800'}`}>
            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <Text className="text-gray-400 text-sm font-medium mb-1">
                        STATUS
                    </Text>
                    <Text className={`text-3xl font-bold ${isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                </View>
                <View className="bg-white/10 p-2 rounded-full">
                    <Switch
                        value={isOnline}
                        onValueChange={onToggle}
                        trackColor={{ false: '#374151', true: '#059669' }}
                        thumbColor={isOnline ? '#10B981' : '#9CA3AF'}
                    />
                </View>
            </View>

            {/* Stats Row */}
            <View className="flex-row justify-between bg-white/5 rounded-2xl p-4">
                <View className="items-center flex-1 border-r border-white/10">
                    <Clock size={20} color="#9CA3AF" className="mb-2" />
                    <Text className="text-white font-bold text-lg">{stats.timeOnline}</Text>
                    <Text className="text-gray-500 text-xs uppercase">Hours</Text>
                </View>
                <View className="items-center flex-1 border-r border-white/10">
                    <MapPin size={20} color="#9CA3AF" className="mb-2" />
                    <Text className="text-white font-bold text-lg">{stats.tripsCompleted}</Text>
                    <Text className="text-gray-500 text-xs uppercase">Trips</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-green-400 font-bold text-xl mb-1">${stats.earnings}</Text>
                    <Text className="text-gray-500 text-xs uppercase">Earned</Text>
                </View>
            </View>
        </View>
    );
};
