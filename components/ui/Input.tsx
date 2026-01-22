import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    icon?: React.ReactNode;
    className?: string;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const Input: React.FC<InputProps> = ({
    value,
    onChangeText,
    placeholder,
    label,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    icon,
    className = '',
    autoCapitalize = 'sentences',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`mb-4 ${className}`}>
            {label && <Text className="text-gray-700 font-medium mb-2">{label}</Text>}
            <View className={`flex-row items-center bg-gray-100 rounded-lg px-4 py-2 ${error ? 'border-2 border-danger' : ''}`}>
                {icon && <View className="mr-2">{icon}</View>}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    className="flex-1 text-base"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize={autoCapitalize}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                            <EyeOff size={20} color="#6B7280" />
                        ) : (
                            <Eye size={20} color="#6B7280" />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
        </View>
    );
};
