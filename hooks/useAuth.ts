import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/store';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export function useAuth() {
    const segments = useSegments();
    const router = useRouter();
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);
    const clearUser = useStore((state) => state.clearUser);

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch profile
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data: profile }) => {
                        if (profile) {
                            setUser({
                                id: profile.id,
                                firstName: profile.first_name,
                                lastName: profile.last_name,
                                phone: profile.phone,
                                email: profile.email,
                                avatarUrl: profile.avatar_url,
                                roles: profile.roles,
                                activeRole: profile.active_role,
                            });
                        }
                    });
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        firstName: profile.first_name,
                        lastName: profile.last_name,
                        phone: profile.phone,
                        email: profile.email,
                        avatarUrl: profile.avatar_url,
                        roles: profile.roles,
                        activeRole: profile.active_role,
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                clearUser();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/');
        } else if (user && inAuthGroup) {
            // Redirect to tabs if authenticated
            router.replace('/(tabs)');
        }
    }, [user, segments]);

    return { user };
}
