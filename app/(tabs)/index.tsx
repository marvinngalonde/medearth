import { theme } from '@/constants/theme';
import { useFeed } from '@/hooks/useFeed';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { Bell, Briefcase, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useStore((state) => state.user);
  const { posts, loading, refresh } = useFeed();

  // Temporary fallback if no posts exist yet (to avoid empty screen during dev)
  const hasPosts = posts && posts.length > 0;

  const renderPost = ({ item }: { item: any }) => {
    // Handle both real data (profiles join) and fallback
    const authorName = item.profiles ? `${item.profiles.first_name} ${item.profiles.last_name}` : item.author || 'Unknown';
    const authorAvatar = item.profiles?.avatar_url || item.authorImage;
    const role = item.author_role || item.authorRole || 'Member';

    return (
      <View className="bg-white mb-4 p-4 border-b border-gray-100">
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: authorAvatar || 'https://via.placeholder.com/40' }}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="font-bold text-gray-900">{authorName}</Text>
              {item.is_verified_post && <Text className="ml-1 text-blue-500 text-xs">☑</Text>}
            </View>
            <Text className="text-xs text-gray-500">{role} • {new Date(item.created_at || Date.now()).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Content */}
        <Text className="text-gray-800 text-base mb-3 leading-6">{item.content}</Text>

        {(item.image_url || item.image) && (
          <Image
            source={{ uri: item.image_url || item.image }}
            className="w-full h-56 rounded-xl mb-3 bg-gray-100"
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
          <TouchableOpacity className="flex-row items-center py-2 px-2">
            <Heart size={20} color={theme.colors.gray[500]} />
            <Text className="ml-2 text-gray-500">{item.likes_count || item.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-2 px-2">
            <MessageCircle size={20} color={theme.colors.gray[500]} />
            <Text className="ml-2 text-gray-500">{item.comments_count || item.comments || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-2 px-2">
            <Share2 size={20} color={theme.colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.gray[50] }}>
      {/* Custom Header */}
      <View style={{ paddingTop: insets.top, backgroundColor: theme.colors.white }} className="px-5 pb-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-500 text-sm">Welcome back,</Text>
            <Text className="text-2xl font-bold text-gray-900">{user?.firstName || 'Guest'}</Text>
          </View>
          <View className="flex-row gap-4">
            {/* Jobs Icon (Replacing Cart) */}
            <TouchableOpacity
              className="bg-gray-50 p-2 rounded-full"
              onPress={() => router.push('/jobs')}
            >
              <Briefcase size={24} color={theme.colors.primary.DEFAULT} />
            </TouchableOpacity>

            {/* Notification Bell */}
            <TouchableOpacity
              className="bg-gray-50 p-2 rounded-full"
              onPress={() => router.push('/notifications')}
            >
              <Bell size={24} color={theme.colors.primary.DEFAULT} />
              {/* Badge could go here */}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar - styled slightly differently for Feed context */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-11">
          <Text className="text-gray-400">🔍</Text>
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search medical news, doctors..."
            placeholderTextColor={theme.colors.gray[400]}
          />
        </View>
      </View>

      {/* Feed Content */}
      <FlatList
        data={hasPosts ? posts : []} // Show empty if no posts, or add mock fallback if desired
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={refresh}
        ListHeaderComponent={() => (
          <View className="bg-white p-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-2">The Pulse</Text>
            <Text className="text-gray-500">Latest updates from the medical community.</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="p-10 items-center">
            <Text className="text-gray-400 text-center">No posts yet. Be the first to start the conversation!</Text>
          </View>
        )}
      />
    </View>
  );
}
