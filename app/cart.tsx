import { SimpleMap } from '@/components/SimpleMap';
import { Button, Card } from '@/components/ui';
import { useStore } from '@/store/store';
import { useRouter } from 'expo-router';
import { CreditCard, Trash2, Wallet } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CartScreen() {
    const router = useRouter();
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const updateQuantity = useStore((state) => state.updateQuantity);
    const getCartTotal = useStore((state) => state.getCartTotal);

    const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'collect'>('delivery');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ecocash' | 'visa'>('cash');

    const deliveryFee = deliveryOption === 'delivery' ? 3.00 : 0;
    const total = getCartTotal() + deliveryFee;

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-6 pt-6">
                {/* Cart Items */}
                <Text className="text-xl font-bold text-gray-800 mb-4">Cart & Checkout</Text>

                {cart.length === 0 ? (
                    <Card className="items-center py-12">
                        <Text className="text-gray-500 text-lg">Your cart is empty</Text>
                    </Card>
                ) : (
                    <>
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
                                onPress={() => setDeliveryOption('collect')}
                                className="flex-1 mr-2"
                            >
                                <Card className={`items-center py-4 ${deliveryOption === 'collect' ? 'border-2 border-primary' : ''}`}>
                                    <Text className="font-semibold">Self Collect</Text>
                                    <Text className="text-sm text-gray-500">Ecocash</Text>
                                </Card>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setDeliveryOption('delivery')}
                                className="flex-1 ml-2"
                            >
                                <Card className={`items-center py-4 ${deliveryOption === 'delivery' ? 'border-2 border-primary' : ''}`}>
                                    <Text className="font-semibold">Delivery ($3.00)</Text>
                                    <Text className="text-sm text-gray-500">Visa</Text>
                                </Card>
                            </TouchableOpacity>
                        </View>

                        {/* Map */}
                        {deliveryOption === 'delivery' && (
                            <View className="mb-4">
                                <Text className="text-lg font-bold text-gray-800 mb-3">Delivery Location</Text>
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
                                <Text className="font-semibold">${getCartTotal().toFixed(2)}</Text>
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
                    </>
                )}
            </ScrollView>

            {cart.length > 0 && (
                <View className="p-6 border-t border-gray-200 bg-white">
                    <Button
                        title="Place Order"
                        onPress={() => router.push('/order-confirmation?orderId=ORD-12345' as any)}
                    />
                </View>
            )}
        </View>
    );
}
