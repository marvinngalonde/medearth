import { theme } from '@/constants/theme';
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

  // Mock Feed Data
  const FEED_POSTS = [
    {
      id: '1',
      author: 'Dr. Sarah Wilson',
      authorRole: 'Cardiologist',
      authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      time: '2h ago',
      content: 'New study shows that daily moderate exercise can reduce heart disease risk by 30% even in patients with family history. #Cardiology #HealthTips',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      likes: 124,
      comments: 18,
    },
    {
      id: '2',
      author: 'MedLink News',
      authorRole: 'Official Update',
      authorImage: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
      time: '5h ago',
      content: 'Flu season is approaching. Check your nearest pharmacy for availability of the new quadrivalent vaccine.',
      image: null,
      likes: 856,
      comments: 42,
    },
    {
      id: '3',
      author: 'Dr. James Chen',
      authorRole: 'Pediatrician',
      authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      time: '1d ago',
      content: 'Case Study: 5-year-old presenting with persistent cough and low-grade fever. Swipe to see X-ray results. diagnosis confirmed: Mycoplasma Pneumonia.',
      image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80',
      likes: 342,
      comments: 89,
    },
  ];

  const renderPost = ({ item }: { item: any }) => (
    <View className="bg-white mb-4 p-4 border-b border-gray-100">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: item.authorImage }}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
        <View className="ml-3 flex-1">
          <Text className="font-bold text-gray-900">{item.author}</Text>
          <Text className="text-xs text-gray-500">{item.authorRole} • {item.time}</Text>
        </View>
      </View>

      {/* Content */}
      <Text className="text-gray-800 text-base mb-3 leading-6">{item.content}</Text>

      {item.image && (
        <Image
          source={{ uri: item.image }}
          className="w-full h-56 rounded-xl mb-3 bg-gray-100"
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between pt-2 border-t border-gray-50">
        <TouchableOpacity className="flex-row items-center py-2 px-2">
          <Heart size={20} color={theme.colors.gray[500]} />
          <Text className="ml-2 text-gray-500">{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-2 px-2">
          <MessageCircle size={20} color={theme.colors.gray[500]} />
          <Text className="ml-2 text-gray-500">{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center py-2 px-2">
          <Share2 size={20} color={theme.colors.gray[500]} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-9">
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
        data={FEED_POSTS}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View className="bg-white p-4 mb-2">
            <Text className="text-lg font-bold text-gray-900 mb-2">The Pulse</Text>
            <Text className="text-gray-500">Latest updates from the medical community.</Text>
          </View>
        )}
      />
    </View>
  );
}
