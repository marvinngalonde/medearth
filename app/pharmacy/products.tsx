import { Badge, Card, Input } from '@/components/ui';
import { useRouter } from 'expo-router';
import { ArrowLeft, Edit, Plus, Search, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function PharmacyProductsScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // Mock products
    const products = [
        {
            id: '1',
            name: 'Paracetamol 500mg',
            price: 2.50,
            stock: 150,
            category: 'Pain Relief',
            image: 'https://via.placeholder.com/80',
            isActive: true,
        },
        {
            id: '2',
            name: 'Ibuprofen 400mg',
            price: 3.00,
            stock: 85,
            category: 'Pain Relief',
            image: 'https://via.placeholder.com/80',
            isActive: true,
        },
        {
            id: '3',
            name: 'Amoxicillin 250mg',
            price: 5.50,
            stock: 0,
            category: 'Antibiotics',
            image: 'https://via.placeholder.com/80',
            isActive: false,
        },
        {
            id: '4',
            name: 'Vitamin C 1000mg',
            price: 4.00,
            stock: 200,
            category: 'Vitamins',
            image: 'https://via.placeholder.com/80',
            isActive: true,
        },
    ];

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold flex-1">Products</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // TODO: Navigate to add product screen
                        }}
                        className="w-10 h-10 bg-white rounded-full items-center justify-center"
                    >
                        <Plus size={24} color="#1E3A8A" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View className="bg-white rounded-full px-4 py-3 flex-row items-center">
                    <Search size={20} color="#6B7280" />
                    <Input
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search products..."
                        className="flex-1 ml-2 mb-0"
                    />
                </View>
            </View>

            {/* Stats */}
            <View className="flex-row px-6 pt-6 pb-4">
                <Card className="flex-1 mr-2 p-4">
                    <Text className="text-gray-600 text-sm mb-1">Total Products</Text>
                    <Text className="text-2xl font-bold text-gray-800">{products.length}</Text>
                </Card>
                <Card className="flex-1 ml-2 p-4">
                    <Text className="text-gray-600 text-sm mb-1">Out of Stock</Text>
                    <Text className="text-2xl font-bold text-danger">
                        {products.filter(p => p.stock === 0).length}
                    </Text>
                </Card>
            </View>

            <ScrollView className="flex-1 px-6">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="mb-3 flex-row items-center p-4">
                        <Image
                            source={{ uri: product.image }}
                            className="w-16 h-16 rounded-lg"
                        />
                        <View className="flex-1 ml-4">
                            <View className="flex-row items-center mb-1">
                                <Text className="font-bold text-gray-800 flex-1">{product.name}</Text>
                                {product.isActive ? (
                                    <Badge text="Active" variant="success" />
                                ) : (
                                    <Badge text="Inactive" variant="default" />
                                )}
                            </View>
                            <Text className="text-gray-600 text-sm mb-1">{product.category}</Text>
                            <View className="flex-row items-center justify-between">
                                <Text className="text-primary font-bold">${product.price.toFixed(2)}</Text>
                                <Text className={`text-sm ${product.stock > 0 ? 'text-gray-600' : 'text-danger'}`}>
                                    Stock: {product.stock}
                                </Text>
                            </View>
                        </View>
                        <View className="ml-3">
                            <TouchableOpacity className="mb-2">
                                <Edit size={20} color="#1E3A8A" />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Trash2 size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}

                {filteredProducts.length === 0 && (
                    <View className="items-center py-12">
                        <Text className="text-gray-500 text-lg">No products found</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
