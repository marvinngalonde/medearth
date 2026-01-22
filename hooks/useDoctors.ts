import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    location: string;
    consultation_fee: number;
    rating: number;
    experience_years: number;
    image_url: string | null;
    categories: string[]; // e.g. ['Cardiology', 'Pediatrics']
    is_available: boolean;
}

export function useDoctors() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .order('rating', { ascending: false });

            if (error) throw error;

            setDoctors(data as Doctor[]);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    return { doctors, loading, error, refresh: fetchDoctors };
}
