import { Card } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
    online: boolean;
}

export default function MessagesScreen() {
    const router = useRouter();

    const chats: Chat[] = [
        {
            id: '1',
            name: 'Highland Family Pharmacy',
            lastMessage: 'Your order is ready for pickup',
            time: '10:30 AM',
            unread: 2,
            avatar: 'https://via.placeholder.com/50',
            online: true,
        },
        {
            id: '2',
            name: 'Dr. Sarafaraz',
            lastMessage: 'Please take the medication as prescribed',
            time: 'Yesterday',
            unread: 0,
            avatar: 'https://via.placeholder.com/50',
            online: false,
        },
        {
            id: '3',
            name: 'Delivery Driver - John',
            lastMessage: 'I am 5 minutes away',
            time: '2 days ago',
            unread: 0,
            avatar: 'https://via.placeholder.com/50',
            online: false,
        },
        {
            id: '4',
            name: 'City Pharmacy',
            lastMessage: 'Thank you for your order!',
            time: '3 days ago',
            unread: 1,
            avatar: 'https://via.placeholder.com/50',
            online: true,
        },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl">
                <Text className="text-white text-2xl font-bold mb-4">Messages</Text>

                {/* Search Bar */}
                <TouchableOpacity className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search conversations...</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {chats.map((chat) => (
                    <TouchableOpacity
                        key={chat.id}
                        onPress={() => router.push(`/conversation/${chat.id}` as any)}
                        className="mb-3"
                    >
                        <Card className="flex-row items-center p-4">
                            <View className="relative">
                                <Image
                                    source={{ uri: chat.avatar }}
                                    className="w-14 h-14 rounded-full"
                                />
                                {chat.online && (
                                    <View className="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full border-2 border-white" />
                                )}
                            </View>

                            <View className="flex-1 ml-4">
                                <View className="flex-row justify-between items-center mb-1">
                                    <Text className="font-bold text-gray-800">{chat.name}</Text>
                                    <Text className="text-xs text-gray-500">{chat.time}</Text>
                                </View>
                                <View className="flex-row justify-between items-center">
                                    <Text
                                        className="text-gray-600 flex-1"
                                        numberOfLines={1}
                                    >
                                        {chat.lastMessage}
                                    </Text>
                                    {chat.unread > 0 && (
                                        <View className="bg-primary w-6 h-6 rounded-full items-center justify-center ml-2">
                                            <Text className="text-white text-xs font-bold">{chat.unread}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
