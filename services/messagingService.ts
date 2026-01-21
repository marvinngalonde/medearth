import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

export interface Conversation {
    id: string;
    created_at: string;
    updated_at: string;
    last_message?: string;
    last_message_at?: string;
    participants: Array<{
        user_id: string;
        profiles: {
            first_name: string;
            last_name: string;
        };
    }>;
}

export const messagingService = {
    // Get user's conversations
    async getConversations(userId: string) {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
        id,
        created_at,
        updated_at,
        conversation_participants!inner (
          user_id,
          profiles (
            id,
            first_name,
            last_name
          )
        ),
        messages (
          content,
          created_at
        )
      `)
            .eq('conversation_participants.user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        // Transform data to include last message
        const conversations = data?.map((conv: any) => {
            const messages = conv.messages || [];
            const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

            return {
                id: conv.id,
                created_at: conv.created_at,
                updated_at: conv.updated_at,
                last_message: lastMessage?.content,
                last_message_at: lastMessage?.created_at,
                participants: conv.conversation_participants.filter((p: any) => p.user_id !== userId),
            };
        });

        return conversations;
    },

    // Get messages for a conversation
    async getMessages(conversationId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select(`
        *,
        profiles (
          id,
          first_name,
          last_name
        )
      `)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data;
    },

    // Send a message
    async sendMessage(conversationId: string, content: string) {
        const user = useStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content,
            })
            .select()
            .single();

        if (error) throw error;

        // Update conversation updated_at
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

        return data;
    },

    // Create a new conversation
    async createConversation(participantIds: string[]) {
        const user = useStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        // Create conversation
        const { data: conversation, error: convError } = await supabase
            .from('conversations')
            .insert({})
            .select()
            .single();

        if (convError) throw convError;

        // Add participants
        const participants = [user.id, ...participantIds].map((userId) => ({
            conversation_id: conversation.id,
            user_id: userId,
        }));

        const { error: participantsError } = await supabase
            .from('conversation_participants')
            .insert(participants);

        if (participantsError) throw participantsError;

        return conversation;
    },

    // Mark messages as read
    async markAsRead(conversationId: string) {
        const user = useStore.getState().user;
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('conversation_id', conversationId)
            .neq('sender_id', user.id);

        if (error) throw error;
    },

    // Subscribe to new messages in a conversation
    subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    callback(payload.new as Message);
                }
            )
            .subscribe();

        return channel;
    },

    // Unsubscribe from messages
    unsubscribeFromMessages(channel: any) {
        supabase.removeChannel(channel);
    },
};
