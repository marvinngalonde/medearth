import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
}) => {
    const baseClasses = 'rounded-lg items-center justify-center';

    const variantClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        outline: 'bg-transparent border-2 border-primary',
        danger: 'bg-danger',
    };

    const sizeClasses = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-8 py-4',
    };

    const textVariantClasses = {
        primary: 'text-white',
        secondary: 'text-white',
        outline: 'text-primary',
        danger: 'text-white',
    };

    const textSizeClasses = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''
                } ${className}`}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#1E3A8A' : '#FFFFFF'} />
            ) : (
                <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]} font-semibold`}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};
