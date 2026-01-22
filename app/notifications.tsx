import { Card } from '@/components/ui';
import { Notification, notificationsService } from '@/services/notificationsService';
import { useStore } from '@/store/store';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Bell, Calendar, Check, Package, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadNotifications();
            const channel = notificationsService.subscribeToNotifications(user.id, (newNotification) => {
                setNotifications((prev) => [newNotification, ...prev]);
            });

            return () => {
                notificationsService.unsubscribeFromNotifications(channel);
            };
        }
    }, [user]);

    const loadNotifications = async () => {
        if (!user) return;
        try {
            const data = await notificationsService.getNotifications(user.id);
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await notificationsService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await notificationsService.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            await notificationsService.markAllAsRead(user.id);
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'order_update':
                return <Package size={24} color="#3B82F6" />;
            case 'message':
                return <Bell size={24} color="#10B981" />;
            case 'appointment':
                return <Calendar size={24} color="#8B5CF6" />;
            case 'delivery':
                return <Package size={24} color="#F59E0B" />;
            default:
                return <Bell size={24} color="#6B7280" />;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Less than 24 hours
        if (diff < 86400000) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        // Less than 7 days
        if (diff < 604800000) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString();
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <Card className={`mb-3 flex-row p-4 ${item.is_read ? 'bg-white' : 'bg-blue-50 border-blue-100'}`}>
            <View className="mr-4 mt-1 bg-white p-2 rounded-full shadow-sm">
                {getIcon(item.type)}
            </View>
            <View className="flex-1">
                <View className="flex-row justify-between items-start">
                    <Text className={`text-base flex-1 mr-2 ${item.is_read ? 'font-semibold text-gray-800' : 'font-bold text-gray-900'}`}>
                        {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500">{formatTime(item.created_at)}</Text>
                </View>
                <Text className="text-gray-600 mt-1 mb-2">{item.message}</Text>
                <View className="flex-row justify-end gap-3 mt-1">
                    {!item.is_read && (
                        <TouchableOpacity onPress={() => markAsRead(item.id)} className="flex-row items-center">
                            <Check size={14} color="#3B82F6" />
                            <Text className="text-blue-500 text-xs ml-1 font-medium">Mark Read</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => deleteNotification(item.id)} className="flex-row items-center">
                        <X size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1 font-medium">Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <Stack.Screen options={{ headerShown: false }} />
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6 shadow-md">
                <View className="flex-row justify-between items-center mb-1">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
                            <ArrowLeft size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text className="text-white text-2xl font-bold">Notifications</Text>
                    </View>
                    <TouchableOpacity onPress={markAllAsRead} className="bg-white/20 px-3 py-1.5 rounded-full">
                        <Text className="text-white text-xs font-medium">Read All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#1E3A8A" />
                </View>
            ) : (
                <View className="flex-1 px-4 pt-4">
                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center py-20 opacity-50">
                                <Bell size={64} color="#9CA3AF" />
                                <Text className="text-gray-500 text-lg mt-4 font-medium">No notifications yet</Text>
                                <Text className="text-gray-400 text-sm mt-1">We'll let you know when updates arrive</Text>
                            </View>
                        }
                    />
                </View>
            )}
        </View>
    );
}
