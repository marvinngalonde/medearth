import { theme } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone, Send, Video } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
    id: string;
    text: string;
    time: string;
    isMine: boolean;
}

export default function ConversationScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [messageText, setMessageText] = useState('');

    // Mock conversation data
    const conversation = {
        id: id as string,
        name: 'Highland Family Pharmacy',
        avatar: 'https://via.placeholder.com/50',
        online: true,
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            time: '10:00 AM',
            isMine: false,
        },
        {
            id: '2',
            text: 'Hi, I wanted to check if my prescription is ready',
            time: '10:05 AM',
            isMine: true,
        },
        {
            id: '3',
            text: 'Let me check for you. One moment please.',
            time: '10:06 AM',
            isMine: false,
        },
        {
            id: '4',
            text: 'Your order is ready for pickup! You can collect it anytime today.',
            time: '10:30 AM',
            isMine: false,
        },
    ]);

    const handleSend = () => {
        if (messageText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: messageText,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                isMine: true,
            };
            setMessages([...messages, newMessage]);
            setMessageText('');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            {/* Header */}
            <View className="bg-primary pt-12 pb-4 px-6">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4">
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View className="relative mr-3">
                            <Image
                                source={{ uri: conversation.avatar }}
                                className="w-10 h-10 rounded-full"
                            />
                            {conversation.online && (
                                <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-primary" />
                            )}
                        </View>

                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg">{conversation.name}</Text>
                            <Text className="text-blue-200 text-sm">
                                {conversation.online ? 'Online' : 'Offline'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row">
                        <TouchableOpacity className="mr-4">
                            <Phone size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Video size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView className="flex-1 px-6 pt-4">
                {messages.map((message) => (
                    <View
                        key={message.id}
                        className={`mb-3 ${message.isMine ? 'items-end' : 'items-start'}`}
                    >
                        <View
                            className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.isMine
                                    ? 'bg-primary'
                                    : 'bg-white'
                                }`}
                            style={!message.isMine ? theme.shadows.sm : {}}
                        >
                            <Text className={message.isMine ? 'text-white' : 'text-gray-800'}>
                                {message.text}
                            </Text>
                        </View>
                        <Text className="text-xs text-gray-500 mt-1 px-2">{message.time}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input */}
            <View className="bg-white border-t border-gray-200 px-6 py-4">
                <View className="flex-row items-center">
                    <TextInput
                        value={messageText}
                        onChangeText={setMessageText}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        className="w-12 h-12 bg-primary rounded-full items-center justify-center"
                    >
                        <Send size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
