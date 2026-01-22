import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/constants/theme';
import { useJobs } from '@/hooks/useJobs';
import { Stack } from 'expo-router';
import { Briefcase, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function JobsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const { jobs, loading, refresh } = useJobs();
    const filteredJobs = jobs.filter(
        (job) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.organization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderJob = ({ item }: { item: any }) => (
        <TouchableOpacity className="bg-white mx-5 mb-4 p-4 rounded-xl shadow-sm border border-gray-100 flex-row">
            <View className="h-12 w-12 bg-blue-50 rounded-lg items-center justify-center mr-4">
                <Briefcase size={24} color={theme.colors.primary.DEFAULT} />
            </View>
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
                <Text className="text-gray-600 font-medium mb-1">{item.organization}</Text>

                <View className="flex-row items-center mb-2">
                    <MapPin size={14} color={theme.colors.gray[400]} />
                    <Text className="text-gray-400 text-xs ml-1">{item.location}</Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                    <View className="bg-gray-100 px-2 py-1 rounded-md">
                        <Text className="text-xs text-gray-600">{item.type}</Text>
                    </View>
                    <View className="bg-green-50 px-2 py-1 rounded-md">
                        <Text className="text-xs text-green-700">{item.salary_range}</Text>
                    </View>
                </View>
            </View>
            <View className="justify-center">
                <Text className="text-blue-500 font-medium">Apply</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.gray[50] }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenHeader
                title="Jobs & Shifts"
                subtitle="Career Opportunities"
                showBack={true}
                searchPlaceholder="Search jobs, locums, hospitals..."
                onSearch={setSearchQuery}
            />

            {/* Filters (Scrollable) */}
            <View className="mb-4 mt-4">
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    data={['All Jobs', 'Doctors', 'Nurses', 'Technicians', 'Admin']}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            className={`mr-3 px-4 py-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-white border border-gray-200'}`}
                        >
                            <Text className={`${index === 0 ? 'text-white' : 'text-gray-700'} font-medium`}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={filteredJobs}
                renderItem={renderJob}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
                refreshing={loading}
                onRefresh={refresh}
                ListEmptyComponent={() => (
                    <View className="p-10 items-center">
                        <Text className="text-gray-400 text-center">No active job listings found.</Text>
                    </View>
                )}
            />
        </View>
    );
}
