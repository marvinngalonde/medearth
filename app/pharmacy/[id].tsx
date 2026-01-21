import { SimpleMap } from '@/components/SimpleMap';
import { Badge, Button, Card } from '@/components/ui';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, DollarSign, MapPin, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Pharmacy {
    id: string;
    name: string;
    description: string;
    address: string;
    phone: string;
    latitude: number;
    longitude: number;
    rating: number;
    total_reviews: number;
    delivery_fee: number;
    image_url: string;
    operating_hours: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    requires_prescription: boolean;
    stock_quantity: number;
}

export default function PharmacyDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPharmacyDetails();
        }
    }, [id]);

    const fetchPharmacyDetails = async () => {
        try {
            // Fetch pharmacy details
            const { data: pharmacyData, error: pharmacyError } = await supabase
                .from('pharmacies')
                .select('*')
                .eq('id', id)
                .single();

            if (pharmacyError) throw pharmacyError;
            setPharmacy(pharmacyData);

            // Fetch products for this pharmacy
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('pharmacy_id', id)
                .eq('is_active', true);

            if (productsError) throw productsError;
            setProducts(productsData || []);

        } catch (error) {
            console.error('Error fetching pharmacy details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    if (!pharmacy) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-500 text-lg">Pharmacy not found</Text>
                <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView>
                {/* Header Image */}
                <View className="relative">
                    <Image
                        source={{ uri: pharmacy.image_url || 'https://via.placeholder.com/300x150' }}
                        className="w-full h-48"
                    />
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="absolute top-12 left-6 w-10 h-10 bg-white rounded-full items-center justify-center"
                        style={theme.shadows.md}
                    >
                        <ArrowLeft size={24} color="#1E3A8A" />
                    </TouchableOpacity>
                </View>

                <View className="px-6 pt-6">
                    {/* Pharmacy Info */}
                    <View className="mb-4">
                        <Text className="text-2xl font-bold text-gray-800 mb-2">{pharmacy.name}</Text>
                        <View className="flex-row items-center mb-2">
                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                            <Text className="ml-1 font-semibold">{pharmacy.rating}</Text>
                            <Text className="text-gray-500 ml-1">({pharmacy.total_reviews} reviews)</Text>
                        </View>
                        {pharmacy.description && (
                            <Text className="text-gray-600 mb-2">{pharmacy.description}</Text>
                        )}
                    </View>

                    {/* Quick Info */}
                    <Card className="mb-4">
                        <View className="flex-row justify-between mb-3">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <DollarSign size={16} color="#6B7280" />
                                    <Text className="ml-1 text-gray-600 text-sm">Delivery Fee</Text>
                                </View>
                                <Text className="font-bold text-gray-800">${pharmacy.delivery_fee?.toFixed(2) || '0.00'}</Text>
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center mb-1">
                                    <Clock size={16} color="#6B7280" />
                                    <Text className="ml-1 text-gray-600 text-sm">Delivery Time</Text>
                                </View>
                                <Text className="font-bold text-gray-800">20-30 min</Text>
                            </View>
                        </View>
                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row items-center mb-1">
                                <Clock size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-700">Open 8:00 AM - 10:00 PM</Text>
                            </View>
                            <View className="flex-row items-center">
                                <MapPin size={16} color="#6B7280" />
                                <Text className="ml-2 text-gray-700 flex-1">{pharmacy.address}</Text>
                            </View>
                        </View>
                    </Card>

                    {/* Map */}
                    <Text className="text-lg font-bold text-gray-800 mb-3">Location</Text>
                    <View className="mb-4 bg-gray-200 h-[200px] rounded-lg overflow-hidden">
                        <SimpleMap
                            latitude={pharmacy.latitude || -17.8252}
                            longitude={pharmacy.longitude || 31.0335}
                            zoom={15}
                            height={200}
                            markers={[{
                                latitude: pharmacy.latitude || -17.8252,
                                longitude: pharmacy.longitude || 31.0335,
                                color: 'red'
                            }]}
                        />
                    </View>

                    {/* Products */}
                    <Text className="text-lg font-bold text-gray-800 mb-3">Products</Text>
                    {products.length === 0 ? (
                        <Text className="text-gray-500 text-center py-4">No products available</Text>
                    ) : (
                        products.map((product) => (
                            <TouchableOpacity
                                key={product.id}
                                onPress={() => router.push(`/product/${product.id}` as any)}
                                className="mb-3"
                            >
                                <Card className="flex-row items-center">
                                    <Image
                                        source={{ uri: product.image_url || 'https://via.placeholder.com/80' }}
                                        className="w-16 h-16 rounded-lg"
                                    />
                                    <View className="flex-1 ml-4">
                                        <Text className="font-bold text-gray-800">{product.name}</Text>
                                        <Text className="text-primary font-semibold mt-1">${product.price.toFixed(2)}</Text>
                                    </View>
                                    {product.stock_quantity > 0 ? (
                                        <Badge text="In Stock" variant="success" />
                                    ) : (
                                        <Badge text="Out of Stock" variant="danger" />
                                    )}
                                </Card>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <View className="h-24" />
            </ScrollView>

            {/* Call Button */}
            <View className="p-6 border-t border-gray-200 bg-white absolute bottom-0 left-0 right-0">
                <Button
                    title={`Call ${pharmacy.name}`}
                    onPress={() => {
                        // TODO: Implement phone call
                        console.log('Calling pharmacy:', pharmacy.phone);
                    }}
                />
            </View>
        </View>
    );
}
