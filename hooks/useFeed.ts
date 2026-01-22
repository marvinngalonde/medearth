import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export interface FeedPost {
    id: string;
    author_id: string;
    author_role: string;
    content: string;
    image_url: string | null;
    likes_count: number;
    comments_count: number;
    is_verified_post: boolean;
    created_at: string;
    profiles: {
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    };
}

export function useFeed() {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          profiles (
            first_name,
            last_name,
            avatar_url
          )
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPosts(data as unknown as FeedPost[]);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load feed');
        } finally {
            setLoading(false);
        }
    };

    const likePost = async (postId: string) => {
        // Optimistic update could go here
        const { error } = await supabase.rpc('increment_likes', { post_id: postId }); // Assuming RPC or direct insert
        // For now, simple refresh
        fetchPosts();
    };

    return { posts, loading, error, refresh: fetchPosts };
}
