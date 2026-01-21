import { supabase } from '@/lib/supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: 'order_update' | 'message' | 'appointment' | 'delivery';
    title: string;
    message: string;
    metadata?: any;
    is_read: boolean;
    created_at: string;
}

export const notificationsService = {
    // Get user's notifications
    async getNotifications(userId: string) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) throw error;
        return data;
    },

    // Create a notification
    async createNotification(
        userId: string,
        type: Notification['type'],
        title: string,
        message: string,
        metadata?: any
    ) {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                title,
                message,
                data: metadata,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Mark notification as read
    async markAsRead(notificationId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) throw error;
    },

    // Mark all notifications as read
    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
    },

    // Subscribe to new notifications
    subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
        const channel = supabase
            .channel(`notifications:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    callback(payload.new as Notification);
                }
            )
            .subscribe();

        return channel;
    },

    // Unsubscribe from notifications
    unsubscribeFromNotifications(channel: any) {
        supabase.removeChannel(channel);
    },

    // Delete a notification
    async deleteNotification(notificationId: string) {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId);

        if (error) throw error;
    },

    // Get unread count
    async getUnreadCount(userId: string) {
        const { count, error } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw error;
        return count || 0;
    },
};
