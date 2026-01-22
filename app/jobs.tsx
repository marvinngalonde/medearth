import { ScreenHeader } from '@/components/ScreenHeader';
import { theme } from '@/constants/theme';
import { Briefcase, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Job {
    id: string;
    title: string;
    hospital: string;
    location: string;
    type: string;
    salary: string;
    postedAt: string;
}

const MOCK_JOBS: Job[] = [
    {
        id: '1',
        title: 'Senior Cardiologist',
        hospital: 'St. Mary\'s Hospital',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$250k - $350k',
        postedAt: '2 days ago',
    },
    {
        id: '2',
        title: 'ER Nurse',
        hospital: 'General City Hospital',
        location: 'Brooklyn, NY',
        type: 'Locum',
        salary: '$60/hr',
        postedAt: '1 day ago',
    },
    {
        id: '3',
        title: 'Medical Laboratory Technician',
        hospital: 'LabCorp',
        location: 'Queens, NY',
        type: 'Full-time',
        salary: '$50k - $70k',
        postedAt: '3 days ago',
    },
    {
        id: '4',
        title: 'Pediatrician',
        hospital: 'Children\'s Health Center',
        location: 'Manhattan, NY',
        type: 'Part-time',
        salary: '$120k - $150k',
        postedAt: '5 hours ago',
    },
];

export default function JobsScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const renderJobItem = ({ item }: { item: Job }) => (
        <TouchableOpacity
            style={{
                backgroundColor: theme.colors.white,
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                ...theme.shadows.sm
            }}
        >
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
                    <Text className="text-gray-600 font-medium">{item.hospital}</Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-primary text-xs font-semibold">{item.type}</Text>
                </View>
            </View>

            <View className="flex-row items-center mb-3">
                <MapPin size={14} color={theme.colors.gray[500]} />
                <Text className="text-gray-500 text-sm ml-1 mr-4">{item.location}</Text>
                <Briefcase size={14} color={theme.colors.gray[500]} />
                <Text className="text-gray-500 text-sm ml-1">{item.postedAt}</Text>
            </View>

            <View className="flex-row justify-between items-center border-t border-gray-100 pt-3">
                <Text className="font-semibold text-gray-900">{item.salary}</Text>
                <Text className="text-primary font-medium">Apply Now</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            <ScreenHeader
                title="Career Opportunities"
                showBack
                searchPlaceholder="Search jobs, hospitals, roles..."
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

            {/* Job List */}
            <FlatList
                data={MOCK_JOBS}
                renderItem={renderJobItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            />
        </View>
    );
}
