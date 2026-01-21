import { Button, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, MessageCircle, Phone, Star } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function DoctorProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    // Mock doctor data
    const doctor = {
        id: id as string,
        name: 'Dr. Sarafaraz',
        specialty: 'Cardiology',
        image: 'https://via.placeholder.com/150',
        rating: 4.8,
        reviews: 124,
        experience: '15 years',
        fee: 15.00,
        location: 'Harare Medical Center',
        about: 'Dr. Sarafaraz is a highly experienced cardiologist specializing in heart disease prevention and treatment. With over 15 years of practice, he has helped thousands of patients maintain healthy hearts.',
        qualifications: [
            'MBBS - University of Zimbabwe',
            'MD Cardiology - University of Cape Town',
            'Fellowship in Interventional Cardiology',
        ],
        availability: [
            { day: 'Monday', time: '9:00 AM - 5:00 PM' },
            { day: 'Wednesday', time: '9:00 AM - 5:00 PM' },
            { day: 'Friday', time: '9:00 AM - 5:00 PM' },
        ],
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-4">
                    <ArrowLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <Image
                        source={{ uri: doctor.image }}
                        className="w-24 h-24 rounded-full border-4 border-white"
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-white text-2xl font-bold">{doctor.name}</Text>
                        <Text className="text-blue-200 text-lg mt-1">{doctor.specialty}</Text>
                        <View className="flex-row items-center mt-2">
                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                            <Text className="text-white ml-1">{doctor.rating}</Text>
                            <Text className="text-blue-200 ml-1">({doctor.reviews} reviews)</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Quick Actions */}
                <View className="flex-row mb-6">
                    <TouchableOpacity className="flex-1 mr-2">
                        <Card className="bg-primary flex-row items-center justify-center py-4">
                            <Phone size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-white font-semibold">Call</Text>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 ml-2">
                        <Card className="bg-secondary flex-row items-center justify-center py-4">
                            <MessageCircle size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-white font-semibold">Message</Text>
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Info Cards */}
                <Card className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <MapPin size={20} color="#6B7280" />
                        <Text className="ml-2 text-gray-700 font-medium">Location</Text>
                    </View>
                    <Text className="text-gray-600">{doctor.location}</Text>
                </Card>

                <Card className="mb-4">
                    <View className="flex-row justify-between mb-3">
                        <View>
                            <Text className="text-gray-500 text-sm">Experience</Text>
                            <Text className="text-gray-800 font-bold text-lg">{doctor.experience}</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-sm">Consultation Fee</Text>
                            <Text className="text-primary font-bold text-lg">${doctor.fee.toFixed(2)}</Text>
                        </View>
                    </View>
                </Card>

                {/* About */}
                <Text className="text-xl font-bold text-gray-800 mb-3">About</Text>
                <Card className="mb-4">
                    <Text className="text-gray-700 leading-6">{doctor.about}</Text>
                </Card>

                {/* Qualifications */}
                <Text className="text-xl font-bold text-gray-800 mb-3">Qualifications</Text>
                <Card className="mb-4">
                    {doctor.qualifications.map((qual, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                            <Text className="text-gray-700 flex-1">{qual}</Text>
                        </View>
                    ))}
                </Card>

                {/* Availability */}
                <Text className="text-xl font-bold text-gray-800 mb-3">Availability</Text>
                <Card className="mb-6">
                    {doctor.availability.map((slot, index) => (
                        <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <Text className="text-gray-700 font-medium">{slot.day}</Text>
                            <Text className="text-gray-600">{slot.time}</Text>
                        </View>
                    ))}
                </Card>
            </ScrollView>

            {/* Book Appointment Button */}
            <View className="p-6 border-t border-gray-200 bg-white">
                <Button
                    title="Book Appointment"
                    onPress={() => router.push(`/appointment-booking?doctorId=${doctor.id}` as any)}
                />
            </View>
        </View>
    );
}
