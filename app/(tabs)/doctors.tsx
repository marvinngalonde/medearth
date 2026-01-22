import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/constants/theme';
import { useDoctors } from '@/hooks/useDoctors';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

export default function DoctorsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { doctors, loading, refresh } = useDoctors();

    const categories = ['All', 'General', 'Cardiologist', 'Dentist', 'Pediatrician'];

    const filteredDoctors = doctors.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || doc.specialty.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    const renderDoctor = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="bg-white p-4 mb-4 rounded-2xl shadow-sm border border-gray-100 mx-5"
            onPress={() => router.push(`/doctor/${item.id}`)}
            style={theme.shadows.sm}
        >
            <View className="flex-row">
                <Image
                    source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                    className="w-20 h-20 rounded-xl bg-gray-200"
                />
                <View className="flex-1 ml-4 justify-between">
                    <View>
                        <View className="flex-row justify-between items-start">
                            <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">{item.name}</Text>
                            <View className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-md">
                                <Star size={12} color={theme.colors.accent.DEFAULT} fill={theme.colors.accent.DEFAULT} />
                                <Text className="ml-1 text-xs font-bold text-yellow-700">{item.rating}</Text>
                            </View>
                        </View>
                        <Text className="text-primary font-medium text-sm">{item.specialty}</Text>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <MapPin size={12} color={theme.colors.gray[500]} />
                        <Text className="text-gray-400 text-xs ml-1 flex-1" numberOfLines={1}>{item.location}</Text>
                    </View>
                </View>
            </View>

            <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-50">
                <View>
                    <Text className="text-xs text-green-600 font-medium">{item.is_available ? 'Available Today' : 'Unavailable'}</Text>
                    <Text className="text-sm font-bold text-gray-900 mt-0.5">${item.consultation_fee} <Text className="text-gray-400 font-normal">/ visit</Text></Text>
                </View>
                <View className="bg-primary px-4 py-2 rounded-lg">
                    <Text className="text-white font-semibold text-sm">Book Now</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.gray[50] }}>
            <ScreenHeader
                title="Find a Doctor"
                subtitle="Specialist Directory"
                searchPlaceholder="Search doctors, specialties..."
                onSearch={setSearchQuery}
            />

            {/* Categories (Horizontal Scroll) */}
            <View className="mt-4 mb-2">
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setActiveCategory(item)}
                            className={`mr-3 px-5 py-2.5 rounded-full ${activeCategory === item ? 'bg-primary' : 'bg-white border border-gray-100'
                                }`}
                        >
                            <Text
                                className={`${activeCategory === item ? 'text-white' : 'text-gray-600'
                                    } font-medium`}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredDoctors}
                renderItem={renderDoctor}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
                refreshing={loading}
                onRefresh={refresh}
                ListEmptyComponent={() => (
                    <View className="p-10 items-center">
                        <Text className="text-gray-400 text-center">No doctors found matching your criteria.</Text>
                    </View>
                )}
            />
        </View>
    );
}
