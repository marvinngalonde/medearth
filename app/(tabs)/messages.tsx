import { ScreenHeader } from '@/components/ScreenHeader';
import { Conversation, messagingService } from '@/services/messagingService';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function MessagesScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dbError, setDbError] = useState(false);

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
        } catch (error: any) {
            if (error?.code === '42P17') {
                console.warn('RLS Recursion Error: Displaying fallback UI');
                setDbError(true);
            } else {
                console.error('Error fetching conversations:', error);
            }
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

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            className="bg-white p-4 mb-2 flex-row items-center border-b border-gray-50"
            onPress={() => router.push(`/conversation/${item.id}` as any)}
        >
            <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mr-3">
                <Text className="text-white text-lg font-bold">
                    {getParticipantName(item).charAt(0)}
                </Text>
            </View>

            <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                    <Text className="font-bold text-gray-900 text-base">
                        {getParticipantName(item)}
                    </Text>
                    <Text className="text-xs text-gray-400">
                        {formatTime(item.last_message_at)}
                    </Text>
                </View>
                <Text className="text-gray-600 text-sm" numberOfLines={1}>
                    {item.last_message || 'No messages yet'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    if (dbError) {
        return (
            <View className="flex-1 bg-white">
                <ScreenHeader
                    title="Messages"
                    searchPlaceholder="Search conversations..."
                    onSearch={setSearchQuery}
                />
                <View className="flex-1 items-center justify-center px-6">
                    <MessageCircle size={48} color="#EF4444" />
                    <Text className="text-danger text-lg font-bold mt-4 text-center">Connection Issue</Text>
                    <Text className="text-gray-500 mt-2 text-center px-4">
                        We encountered a security policy error (RLS Recursion).
                        {'\n\n'}
                        Please run the "Emergency Fix" SQL script to resolve this immediately.
                    </Text>
                    <TouchableOpacity
                        onPress={fetchConversations}
                        className="mt-6 bg-primary px-6 py-3 rounded-full"
                    >
                        <Text className="text-white font-semibold">Retry</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScreenHeader
                title="Messages"
                searchPlaceholder="Search conversations..."
                onSearch={setSearchQuery}
            />

            {conversations.length === 0 ? (
                <View className="flex-1 items-center justify-center -mt-20">
                    <MessageCircle size={48} color="#9CA3AF" />
                    <Text className="text-gray-500 text-lg mt-4">No messages yet</Text>
                    <Text className="text-gray-400 mt-2">Start a conversation from a Doctor's profile</Text>
                </View>
            ) : (
                <FlatList
                    data={conversations}
                    renderItem={renderConversation}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            )}
        </View>
    );
}
