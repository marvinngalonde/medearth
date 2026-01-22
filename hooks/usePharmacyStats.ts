import { PharmacyStats } from '@/components/pharmacy/BentoGrid';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';

export function usePharmacyStats() {
    const user = useStore((state) => state.user);
    const [stats, setStats] = useState<PharmacyStats>({
        activeOrders: 0,
        revenueToday: 0,
        lowStockCount: 0,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);

            // 1. Get Pharmacy ID for current user
            const { data: pharmacy } = await supabase
                .from('pharmacies')
                .select('id')
                .eq('owner_id', user!.id)
                .single();

            if (!pharmacy) return;

            // 2. Count Active Orders
            const { count: activeOrders } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq('pharmacy_id', pharmacy.id)
                .in('status', ['pending', 'confirmed', 'packing', 'ready']);

            // 3. Calculate Revenue Today
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: todayOrders } = await supabase
                .from('orders')
                .select('total')
                .eq('pharmacy_id', pharmacy.id)
                .gte('created_at', today.toISOString());

            const revenueToday = todayOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

            // 4. Low Stock Count
            const { count: lowStock } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('pharmacy_id', pharmacy.id)
                .lt('stock_quantity', 10);

            // 5. Total Products
            const { count: totalProducts } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('pharmacy_id', pharmacy.id);


            setStats({
                activeOrders: activeOrders || 0,
                revenueToday,
                lowStockCount: lowStock || 0,
                totalProducts: totalProducts || 0,
            });

        } catch (error) {
            console.error('Error fetching pharmacy stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return { stats, loading, refresh: fetchStats };
}
