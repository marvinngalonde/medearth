import { Card } from '@/components/ui';
import { Conversation, messagingService } from '@/services/messagingService';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { MessageCircle, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MessagesScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        if (!user) return;

        try {
            const data = await messagingService.getConversations(user.id);
            setConversations(data || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const getParticipantName = (conversation: Conversation) => {
        if (conversation.participants.length === 0) return 'Unknown';
        const participant = conversation.participants[0];
        return `${participant.profiles.first_name} ${participant.profiles.last_name}`;
    };

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <Text className="text-white text-2xl font-bold mb-4">Messages</Text>

                {/* Search Bar */}
                <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Text className="ml-2 text-gray-400">Search messages...</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {conversations.length === 0 ? (
                    <View className="items-center py-12">
                        <MessageCircle size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 text-lg mt-4">No messages yet</Text>
                        <Text className="text-gray-400 mt-2">Start a conversation</Text>
                    </View>
                ) : (
                    conversations.map((conversation) => (
                        <TouchableOpacity
                            key={conversation.id}
                            onPress={() => router.push(`/conversation/${conversation.id}` as any)}
                            className="mb-3"
                        >
                            <Card className="p-4 flex-row items-center">
                                <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-3">
                                    <Text className="text-white text-lg font-bold">
                                        {getParticipantName(conversation).charAt(0)}
                                    </Text>
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row justify-between items-start mb-1">
                                        <Text className="font-bold text-gray-800">
                                            {getParticipantName(conversation)}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">
                                            {formatTime(conversation.last_message_at)}
                                        </Text>
                                    </View>
                                    <Text className="text-gray-600 text-sm" numberOfLines={1}>
                                        {conversation.last_message || 'No messages yet'}
                                    </Text>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
