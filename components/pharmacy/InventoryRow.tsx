import { Edit2 } from 'lucide-react-native';
import React from 'react';
import { Image, Switch, Text, TouchableOpacity, View } from 'react-native';

export interface ProductInventory {
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    image_url: string | null;
    is_active: boolean;
}

interface InventoryRowProps {
    product: ProductInventory;
    onToggleStatus: (id: string, currentStatus: boolean) => void;
    onEdit: (id: string) => void;
}

export const InventoryRow = ({ product, onToggleStatus, onEdit }: InventoryRowProps) => {
    return (
        <View className="flex-row items-center bg-white p-3 rounded-xl mb-2 border border-gray-100 shadow-sm">
            <Image
                source={{ uri: product.image_url || 'https://via.placeholder.com/80' }}
                className="w-12 h-12 rounded-lg bg-gray-100 mr-3"
            />

            <View className="flex-1">
                <Text className="font-bold text-gray-900" numberOfLines={1}>{product.name}</Text>
                <View className="flex-row items-center mt-1">
                    <Text className="text-primary font-bold mr-3">${product.price.toFixed(2)}</Text>
                    <Text className={`${product.stock_quantity < 10 ? 'text-red-500' : 'text-gray-500'} text-xs`}>
                        {product.stock_quantity} in stock
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <Switch
                    value={product.is_active}
                    onValueChange={() => onToggleStatus(product.id, product.is_active)}
                    trackColor={{ false: '#E5E7EB', true: '#D1FAE5' }}
                    thumbColor={product.is_active ? '#10B981' : '#F3F4F6'}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                />
                <TouchableOpacity onPress={() => onEdit(product.id)} className="p-2 bg-gray-50 rounded-full">
                    <Edit2 size={16} color="#6B7280" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
