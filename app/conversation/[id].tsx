import { Message, messagingService } from '@/services/messagingService';
import { useStore } from '@/store/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ConversationScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const user = useStore((state) => state.user);
    const scrollViewRef = useRef<ScrollView>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (id && user) {
            fetchMessages();
            markAsRead();

            // Subscribe to real-time messages
            const channel = messagingService.subscribeToMessages(
                id as string,
                (message) => {
                    setMessages((prev) => [...prev, message]);
                    scrollToBottom();
                }
            );

            return () => {
                messagingService.unsubscribeFromMessages(channel);
            };
        }
    }, [id, user]);

    const fetchMessages = async () => {
        try {
            const data = await messagingService.getMessages(id as string);
            setMessages(data || []);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await messagingService.markAsRead(id as string);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await messagingService.sendMessage(id as string, newMessage.trim());
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            {/* Header */}
            <View className="bg-primary pt-12 pb-4 px-6">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">Conversation</Text>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-6 pt-4"
                onContentSizeChange={scrollToBottom}
            >
                {messages.map((message) => {
                    const isOwn = message.sender_id === user?.id;

                    return (
                        <View
                            key={message.id}
                            className={`mb-3 ${isOwn ? 'items-end' : 'items-start'}`}
                        >
                            <View
                                className={`max-w-[75%] px-4 py-3 rounded-2xl ${isOwn
                                        ? 'bg-primary rounded-br-none'
                                        : 'bg-white rounded-bl-none'
                                    }`}
                            >
                                <Text className={isOwn ? 'text-white' : 'text-gray-800'}>
                                    {message.content}
                                </Text>
                            </View>
                            <Text className="text-gray-500 text-xs mt-1">
                                {formatTime(message.created_at)}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            {/* Input */}
            <View className="bg-white border-t border-gray-200 px-6 py-4">
                <View className="flex-row items-center">
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        disabled={!newMessage.trim() || sending}
                        className={`w-12 h-12 rounded-full items-center justify-center ${newMessage.trim() && !sending ? 'bg-primary' : 'bg-gray-300'
                            }`}
                    >
                        <Send size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
