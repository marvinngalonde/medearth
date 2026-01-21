import { Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { AlertCircle, Heart, MapPin, RefreshCw, Search, Upload } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const cart = useStore((state) => state.cart);

  const quickActions = [
    { icon: Upload, label: 'Upload Script', color: '#3B82F6' },
    { icon: RefreshCw, label: 'Refill Order', color: '#10B981' },
    { icon: Heart, label: 'My Health', color: '#EF4444' },
    { icon: AlertCircle, label: 'Emergency', color: '#F59E0B' },
  ];

  const dealsNearYou = [
    {
      id: '1',
      name: 'New Med-Link',
      image: 'https://via.placeholder.com/150',
      type: 'Pharmacy',
    },
    {
      id: '2',
      name: 'Delicious Food',
      image: 'https://via.placeholder.com/150',
      type: 'Restaurant',
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary pt-12 pb-6 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-white text-2xl font-bold">MedLink</Text>
            <Text className="text-blue-200 mt-1">Hello, {user?.firstName || 'Naomi'}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            className="relative"
          >
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Text className="text-white text-lg">🛒</Text>
            </View>
            {cart.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-danger w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          onPress={() => router.push('/search-results?query=' as any)}
          className="bg-white rounded-full px-4 py-3 flex-row items-center mb-6"
          style={theme.shadows.sm}
        >
          <Search size={20} color="#6B7280" />
          <Text className="ml-2 text-gray-400">Search for medicines...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Quick Actions */}
        <View className="mb-6">
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] mb-4"
              >
                <Card className="items-center py-6">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <action.icon size={24} color={action.color} />
                  </View>
                  <Text className="text-gray-700 font-medium text-center">
                    {action.label}
                  </Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Deals Near You */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Deals Near You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dealsNearYou.map((deal) => (
              <TouchableOpacity key={deal.id} className="mr-4">
                <Card className="w-64">
                  <Image
                    source={{ uri: deal.image }}
                    className="w-full h-32 rounded-lg mb-2"
                  />
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="font-semibold text-gray-800">{deal.name}</Text>
                      <Text className="text-gray-500 text-sm">{deal.type}</Text>
                    </View>
                    <MapPin size={16} color="#6B7280" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
