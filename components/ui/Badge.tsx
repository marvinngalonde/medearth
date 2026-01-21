import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
    text: string;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', className = '' }) => {
    const variantClasses = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        default: 'bg-gray-100 text-gray-700',
    };

    const colors = variantClasses[variant].split(' ');

    return (
        <View className={`${colors[0]} px-3 py-1 rounded-full ${className}`}>
            <Text className={`${colors[1]} text-xs font-medium`}>{text}</Text>
        </View>
    );
};
