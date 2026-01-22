import { theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    searchPlaceholder?: string;
    onSearch?: (text: string) => void;
    rightAction?: React.ReactNode;
}

export function ScreenHeader({
    title,
    subtitle,
    showBack = false,
    searchPlaceholder,
    onSearch,
    rightAction,
}: ScreenHeaderProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ paddingTop: insets.top }}
            className="bg-primary px-5 pb-6 rounded-b-[32px] shadow-sm z-10"
        >
            {/* Top Row: Navigation/Title & Actions */}
            <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center flex-1">
                    {showBack && (
                        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
                            <ArrowLeft size={24} color="white" />
                        </TouchableOpacity>
                    )}
                    <View>
                        {/* If subtitle exists, show it small above title. If not, just title.
                Matching Home: Small/Gray Text -> Large/Bold Text */}
                        {subtitle && <Text className="text-blue-100 text-sm mb-0.5 font-medium">{subtitle}</Text>}
                        <Text className="text-2xl font-bold text-white leading-tight">{title}</Text>
                    </View>
                </View>

                {/* Right Actions (e.g., Filter ICON, or Notification Bell) */}
                {rightAction && (
                    <View className="flex-row gap-4 ml-4">
                        {rightAction}
                    </View>
                )}
            </View>

            {/* Optional Search Bar */}
            {searchPlaceholder && (
                <View className="flex-row items-center bg-white rounded-2xl px-4 h-9 shadow-sm">
                    <Search size={20} color={theme.colors.gray[400]} />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-900"
                        placeholder={searchPlaceholder}
                        placeholderTextColor={theme.colors.gray[400]}
                        onChangeText={onSearch}
                    />
                </View>
            )}
        </View>
    );
}
