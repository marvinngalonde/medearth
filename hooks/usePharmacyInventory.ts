import { ProductInventory } from '@/components/pharmacy/InventoryRow';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';

export function usePharmacyInventory() {
    const user = useStore((state) => state.user);
    const [products, setProducts] = useState<ProductInventory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchInventory();
    }, [user]);

    const fetchInventory = async () => {
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
                .from('products')
                .select('*')
                .eq('pharmacy_id', pharmacy.id)
                .order('name');

            if (error) throw error;
            setProducts(data as ProductInventory[]);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleProductStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic update
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } catch (error) {
            console.error('Error toggling product status:', error);
        }
    };

    return { products, loading, toggleProductStatus, refresh: fetchInventory };
}
