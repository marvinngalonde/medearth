import { KanbanOrder } from '@/components/pharmacy/OrdersKanban';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';

export function usePharmacyOrders() {
    const user = useStore((state) => state.user);
    const [orders, setOrders] = useState<KanbanOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchOrders();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('pharmacy_orders')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => fetchOrders()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            // Get Pharmacy ID
            const { data: pharmacy } = await supabase
                .from('pharmacies')
                .select('id')
                .eq('owner_id', user!.id)
                .single();

            if (!pharmacy) return;

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    id, 
                    order_number, 
                    status, 
                    created_at,
                    profiles:customer_id (first_name, last_name),
                    order_items (id)
                `)
                .eq('pharmacy_id', pharmacy.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedOrders: KanbanOrder[] = data.map((order: any) => ({
                id: order.id,
                order_number: order.order_number,
                status: order.status,
                customer_name: `${order.profiles?.first_name || 'Guest'} ${order.profiles?.last_name || ''}`,
                items_count: order.order_items?.length || 0,
                time_ago: formatTimeAgo(order.created_at),
            }));

            setOrders(formattedOrders);

        } catch (error) {
            console.error('Error fetching pharmacy orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            // Optimistic update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return { orders, loading, updateOrderStatus, refresh: fetchOrders };
}
