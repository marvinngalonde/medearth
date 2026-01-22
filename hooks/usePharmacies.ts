import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Pharmacy {
    id: string;
    name: string;
    address: string;
    rating: number;
    image_url: string;
    is_open: boolean;
    delivery_fee: number;
    delivery_time: string;
    phone: string;
}

export function usePharmacies() {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('pharmacies')
                .select('*')
                .eq('is_active', true)
                .order('rating', { ascending: false });

            if (error) throw error;

            setPharmacies(data as Pharmacy[]);
        } catch (err) {
            console.error('Error fetching pharmacies:', err);
            // Fallback to empty list or handle error gracefully
            setError('Failed to load pharmacies');
        } finally {
            setLoading(false);
        }
    };

    return { pharmacies, loading, error, refresh: fetchPharmacies };
}
