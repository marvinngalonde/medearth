import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface Job {
    id: string;
    title: string;
    organization: string;
    location: string;
    type: string;
    salary_range: string;
    description: string;
    requirements: string[];
    created_at: string;
}

export function useJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setJobs(data as Job[]);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    return { jobs, loading, error, refresh: fetchJobs };
}
