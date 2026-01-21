import { Badge, Button } from '@/components/ui';
import { useStore } from '@/store/store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

export default function ProductDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const addToCart = useStore((state) => state.addToCart);

    const [quantity, setQuantity] = useState(1);

    // Mock product data
    const product = {
        id: id as string,
        name: 'Benylin 4 Flu Syrup',
        price: 5.00,
        image: 'https://via.placeholder.com/300',
        inStock: true,
        requiresPrescription: true,
        description: 'Prescription only compound',
    };

    const handleAddToCart = () => {
        addToCart({
            id: Math.random().toString(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            requiresPrescription: product.requiresPrescription,
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Product Image */}
                <Image
                    source={{ uri: product.image }}
                    className="w-full h-80"
                />

                <View className="p-6">
                    {/* Product Info */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800 mb-2">{product.name}</Text>
                            <Text className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</Text>
                        </View>
                        {product.inStock ? (
                            <Badge text="In Stock" variant="success" />
                        ) : (
                            <Badge text="Out of Stock" variant="danger" />
                        )}
                    </View>

                    {/* Prescription Warning */}
                    {product.requiresPrescription && (
                        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex-row">
                            <AlertCircle size={20} color="#F59E0B" />
                            <View className="ml-3 flex-1">
                                <Text className="text-yellow-800 font-semibold mb-1">Prescription Required</Text>
                                <Text className="text-yellow-700 text-sm">{product.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Upload Prescription */}
                    {product.requiresPrescription && (
                        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                            <Text className="text-gray-700 font-medium mb-2">Upload photo of script</Text>
                            <Button
                                title="Choose File"
                                variant="outline"
                                size="sm"
                                onPress={() => {
                                    // TODO: Implement file picker
                                    console.log('File picker');
                                }}
                            />
                        </View>
                    )}

                    {/* Quantity Selector */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-medium mb-2">Quantity</Text>
                        <View className="flex-row items-center">
                            <Button
                                title="-"
                                variant="outline"
                                size="sm"
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12"
                            />
                            <Text className="mx-6 text-lg font-bold">{quantity}</Text>
                            <Button
                                title="+"
                                variant="outline"
                                size="sm"
                                onPress={() => setQuantity(quantity + 1)}
                                className="w-12"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart Button */}
            <View className="p-6 border-t border-gray-200">
                <Button
                    title="Add to Cart"
                    onPress={handleAddToCart}
                    disabled={!product.inStock}
                />
            </View>
        </View>
    );
}
