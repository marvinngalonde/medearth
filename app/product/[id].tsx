import { Badge, Button } from '@/components/ui';
import { theme } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { storageService } from '@/services/storageService';
import { useStore } from '@/store/store';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertCircle, Check, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProductDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const user = useStore((state) => state.user);
    const addToCart = useStore((state) => state.addToCart);

    const [quantity, setQuantity] = useState(1);
    const [prescriptionUrl, setPrescriptionUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Product not found');
            router.back();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color={theme.colors.primary.DEFAULT} />
            </View>
        );
    }

    if (!product) return null;

    const pickPrescription = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to upload a prescription');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                uploadPrescription(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadPrescription = async (uri: string) => {
        if (!user) return;

        try {
            setUploading(true);

            // Create a file object from uri
            const response = await fetch(uri);
            const blob = await response.blob();

            // Upload to Supabase
            // Note: In storageService we defined uploadPrescription to take 'application/pdf' 
            // but here we are using images, so let's adjust or trust the service handles it. 
            // Actually storageService forces 'application/pdf' in uploadPrescription, 
            // but we are picking an image. Better to use general uploadFile or modify service.
            // For now, let's use a generic upload to prescriptions bucket with correct mime type.

            const timestamp = Date.now();
            const filePath = `${user.id}/${timestamp}.jpg`;
            const publicUrl = await storageService.uploadFile('prescriptions', filePath, blob, 'image/jpeg');

            // The policy for 'prescriptions' bucket is private, so 'getPublicUrl' might return a URL 
            // but it won't be publicly accessible without a signed URL. 
            // However, Supabase storage policies control access.
            // For this implementation, we'll store the path or returned URL.
            // Actually, storageService.uploadFile returns the "data" object which has "path".
            // But our storageService.uploadFile returns data directly.

            // Let's rely on the returned structure.
            // Wait, storageService.uploadFile returns `data` from supabase upload, which usually contains `path`.
            // But our service wraps it. 
            // Let's assume we get the path and construct the URL access later or just store the path.
            // For cart item, we probably need a reference.

            // Let's simplify and just use the returned path/url logic from a fixed upload helper
            // We'll trust the user to upload images for now.

            setPrescriptionUrl(filePath); // Storing filePath as reference

        } catch (error) {
            Alert.alert('Error', 'Failed to upload prescription');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddToCart = () => {
        if (product.requires_prescription && !prescriptionUrl) {
            Alert.alert('Required', 'Please upload a prescription for this item');
            return;
        }

        addToCart({
            id: Math.random().toString(),
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image_url,
            requiresPrescription: product.requires_prescription,
            prescriptionUrl: prescriptionUrl || undefined,
        });

        Alert.alert('Added to Cart', 'Item added successfully', [
            { text: 'Keep Shopping', style: 'cancel' },
            { text: 'View Cart', onPress: () => router.push('/cart') }
        ]);
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="flex-1">
                {/* Product Image */}
                <Image
                    source={{ uri: product.image_url || 'https://via.placeholder.com/300' }}
                    className="w-full h-80"
                />

                <View className="p-6">
                    {/* Product Info */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-gray-800 mb-2">{product.name}</Text>
                            <Text className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</Text>
                        </View>
                        {product.stock_quantity > 0 ? (
                            <Badge text="In Stock" variant="success" />
                        ) : (
                            <Badge text="Out of Stock" variant="danger" />
                        )}
                    </View>

                    {/* Prescription Warning */}
                    {product.requires_prescription && (
                        <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 flex-row">
                            <AlertCircle size={20} color="#F59E0B" />
                            <View className="ml-3 flex-1">
                                <Text className="text-yellow-800 font-semibold mb-1">Prescription Required</Text>
                                <Text className="text-yellow-700 text-sm">{product.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Upload Prescription */}
                    {product.requires_prescription && (
                        <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-700 font-medium">Upload Prescription</Text>
                                {prescriptionUrl && (
                                    <TouchableOpacity onPress={() => setPrescriptionUrl(null)}>
                                        <Text className="text-red-500 text-xs">Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {!prescriptionUrl ? (
                                <TouchableOpacity
                                    onPress={pickPrescription}
                                    disabled={uploading}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-white"
                                >
                                    {uploading ? (
                                        <ActivityIndicator color="#1E3A8A" />
                                    ) : (
                                        <>
                                            <Upload size={24} color="#6B7280" className="mb-2" />
                                            <Text className="text-gray-500 font-medium">Tap to upload photo</Text>
                                            <Text className="text-gray-400 text-xs mt-1">Images only (JPG, PNG)</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View className="flex-row items-center bg-green-50 border border-green-200 rounded-lg p-3">
                                    <View className="bg-green-100 p-2 rounded-full mr-3">
                                        <Check size={16} color="#059669" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-green-800 font-medium">Prescription Uploaded</Text>
                                        <Text className="text-green-600 text-xs">Ready to submit with order</Text>
                                    </View>
                                </View>
                            )}
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
                    disabled={product.stock_quantity === 0 || (product.requires_prescription && !prescriptionUrl)}
                />
            </View>
        </View>
    );
}
