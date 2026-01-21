import { SimpleMap } from '@/components/SimpleMap';
import { Button, Card } from '@/components/ui';
import { ordersService } from '@/services/ordersService';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { CreditCard, Trash2, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
    const router = useRouter();
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const clearCart = useStore((state) => state.clearCart);
    const user = useStore((state) => state.user);

    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ecocash' | 'visa'>('cash');
    const [loading, setLoading] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = deliveryType === 'delivery' ? 2.50 : 0;
    const total = subtotal + deliveryFee;

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'Please login to place an order');
            router.push('/');
            return;
        }

        // Group items by pharmacy
        const itemsByPharmacy = cart.reduce((acc, item) => {
            const pharmacyId = item.pharmacyId || 'unknown';
            if (!acc[pharmacyId]) {
                acc[pharmacyId] = [];
            }
            acc[pharmacyId].push(item);
            return acc;
        }, {} as Record<string, typeof cart>);

        setLoading(true);
        try {
            // Create orders for each pharmacy
            const orderPromises = Object.entries(itemsByPharmacy).map(([pharmacyId, items]) =>
                ordersService.createOrder({
                    pharmacy_id: pharmacyId,
                    delivery_type: deliveryType,
                    delivery_address: deliveryType === 'delivery' ? '123 Main St, Harare' : undefined,
                    delivery_latitude: deliveryType === 'delivery' ? -17.8252 : undefined,
                    delivery_longitude: deliveryType === 'delivery' ? 31.0335 : undefined,
                    payment_method: paymentMethod,
                    items: items.map((item) => ({
                        product_id: item.id,
                        product_name: item.name,
                        product_price: item.price,
                        quantity: item.quantity,
                    })),
                })
            );

            await Promise.all(orderPromises);

            clearCart();
            router.push('/order-confirmation');
        } catch (error: any) {
            console.error(error);
            Alert.alert('Order Failed', error.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center px-6">
                <Text className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</Text>
                <Text className="text-gray-600 mb-6">Add some items to get started</Text>
                <Button
                    title="Browse Products"
                    onPress={() => router.push('/(tabs)/pharmacies')}
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-6 pt-6">
                {/* Cart Items */}
                <Text className="text-xl font-bold text-gray-800 mb-4">Cart & Checkout</Text>

                {cart.map((item) => (
                    <Card key={item.id} className="mb-3 flex-row items-center">
                        <Image
                            source={{ uri: item.image || 'https://via.placeholder.com/80' }}
                            className="w-20 h-20 rounded-lg"
                        />
                        <View className="flex-1 ml-4">
                            <Text className="font-bold text-gray-800">{item.name}</Text>
                            <Text className="text-primary font-semibold mt-1">
                                ${item.price.toFixed(2)}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                    className="w-8 h-8 bg-gray-200 rounded items-center justify-center"
                                >
                                    <Text className="font-bold">-</Text>
                                </TouchableOpacity>
                                <Text className="mx-3 font-semibold">{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                                    className="w-8 h-8 bg-gray-200 rounded items-center justify-center"
                                >
                                    <Text className="font-bold">+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => removeFromCart(item.productId)}
                            className="ml-2"
                        >
                            <Trash2 size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </Card>
                ))}

                {/* Delivery Options */}
                <Text className="text-lg font-bold text-gray-800 mt-6 mb-3">Delivery Options</Text>
                <View className="flex-row mb-4">
                    <TouchableOpacity
                        onPress={() => setDeliveryType('pickup')}
                        className="flex-1 mr-2"
                    >
                        <Card className={`items-center py-4 ${deliveryType === 'pickup' ? 'border-2 border-primary' : ''}`}>
                            <Text className="font-semibold">Self Collect</Text>
                            <Text className="text-sm text-gray-500">Free</Text>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDeliveryType('delivery')}
                        className="flex-1 ml-2"
                    >
                        <Card className={`items-center py-4 ${deliveryType === 'delivery' ? 'border-2 border-primary' : ''}`}>
                            <Text className="font-semibold">Delivery ($2.50)</Text>
                            <Text className="text-sm text-gray-500">To your door</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Map */}
                {deliveryType === 'delivery' && (
                    <View className="mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">Delivery Location</Text>
                        <View className="h-48 rounded-lg overflow-hidden bg-gray-200">
                            <SimpleMap
                                latitude={-17.8252}
                                longitude={31.0335}
                                zoom={15}
                                height={192}
                                markers={[
                                    { latitude: -17.8252, longitude: 31.0335, color: 'blue' }
                                ]}
                            />
                        </View>
                    </View>
                )}

                {/* Payment Methods */}
                <Text className="text-lg font-bold text-gray-800 mt-6 mb-3">Payment</Text>
                <View className="mb-4">
                    {[
                        { id: 'cash', label: 'Cash on Delivery', icon: Wallet },
                        { id: 'ecocash', label: 'Ecocash', icon: CreditCard },
                        { id: 'visa', label: 'Visa', icon: CreditCard },
                    ].map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            onPress={() => setPaymentMethod(method.id as any)}
                            className="mb-2"
                        >
                            <Card className={`flex-row items-center p-4 ${paymentMethod === method.id ? 'border-2 border-primary' : ''}`}>
                                <method.icon size={20} color="#6B7280" />
                                <Text className="ml-3 font-medium">{method.label}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Order Summary */}
                <Card className="mb-6">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Subtotal</Text>
                        <Text className="font-semibold">${subtotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Delivery Fee</Text>
                        <Text className="font-semibold">${deliveryFee.toFixed(2)}</Text>
                    </View>
                    <View className="border-t border-gray-200 pt-2 mt-2 flex-row justify-between">
                        <Text className="font-bold text-lg">Total</Text>
                        <Text className="font-bold text-lg text-primary">${total.toFixed(2)}</Text>
                    </View>
                </Card>
                <View className="h-24" />
            </ScrollView>

            {cart.length > 0 && (
                <View className="p-6 border-t border-gray-200 bg-white absolute bottom-0 left-0 right-0">
                    <Button
                        title={loading ? "Placing Order..." : "Place Order"}
                        onPress={handlePlaceOrder}
                        disabled={loading}
                    />
                </View>
            )}
        </View>
    );
}
