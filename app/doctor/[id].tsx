import { Button, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, MessageCircle, Phone, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    image_url: string;
    rating: number;
    total_reviews: number;
    experience_years: number;
    consultation_fee: number;
    location: string;
    bio: string;
    qualifications: string[];
    phone: string;
}

interface DoctorAvailability {
    day_of_week: number;
    start_time: string;
    end_time: string;
}

export default function DoctorProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDoctorDetails();
        }
    }, [id]);

    const fetchDoctorDetails = async () => {
        try {
            // Fetch doctor details
            const { data: doctorData, error: doctorError } = await supabase
                .from('doctors')
                .select('*')
                .eq('id', id)
                .single();

            if (doctorError) throw doctorError;
            setDoctor(doctorData);

            // Fetch availability
            const { data: availabilityData, error: availabilityError } = await supabase
                .from('doctor_availability')
                .select('*')
                .eq('doctor_id', id)
                .eq('is_active', true);

            if (availabilityError) throw availabilityError;
            setAvailability(availabilityData || []);

        } catch (error) {
            console.error('Error fetching doctor details:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (dayOfWeek: number) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    };

    if (loading) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
            </View>
        );
    }

    if (!doctor) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-500 text-lg">Doctor not found</Text>
                <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <TouchableOpacity onPress={() => router.back()} className="mb-4">
                    <ArrowLeft size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <Image
                        source={{ uri: doctor.image_url || 'https://via.placeholder.com/150' }}
                        className="w-24 h-24 rounded-full border-4 border-white"
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-white text-2xl font-bold">{doctor.name}</Text>
                        <Text className="text-blue-200 text-lg mt-1">{doctor.specialty}</Text>
                        <View className="flex-row items-center mt-2">
                            <Star size={16} color="#F59E0B" fill="#F59E0B" />
                            <Text className="text-white ml-1">{doctor.rating}</Text>
                            <Text className="text-blue-200 ml-1">({doctor.total_reviews} reviews)</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Quick Actions */}
                <View className="flex-row mb-6">
                    <TouchableOpacity className="flex-1 mr-2" onPress={() => console.log('Call doctor')}>
                        <Card className="bg-primary flex-row items-center justify-center py-4">
                            <Phone size={20} color="#FFFFFF" />
                            <Text className="ml-2 text-white font-semibold">Call</Text>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 ml-2" onPress={() => console.log('Message doctor')}>
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
                            <Text className="text-gray-800 font-bold text-lg">{doctor.experience_years} years</Text>
                        </View>
                        <View>
                            <Text className="text-gray-500 text-sm">Consultation Fee</Text>
                            <Text className="text-primary font-bold text-lg">${doctor.consultation_fee?.toFixed(2)}</Text>
                        </View>
                    </View>
                </Card>

                {/* About */}
                <Text className="text-xl font-bold text-gray-800 mb-3">About</Text>
                <Card className="mb-4">
                    <Text className="text-gray-700 leading-6">{doctor.bio || 'No biography available.'}</Text>
                </Card>

                {/* Qualifications */}
                {doctor.qualifications && doctor.qualifications.length > 0 && (
                    <>
                        <Text className="text-xl font-bold text-gray-800 mb-3">Qualifications</Text>
                        <Card className="mb-4">
                            {doctor.qualifications.map((qual, index) => (
                                <View key={index} className="flex-row items-center mb-2">
                                    <View className="w-2 h-2 bg-primary rounded-full mr-3" />
                                    <Text className="text-gray-700 flex-1">{qual}</Text>
                                </View>
                            ))}
                        </Card>
                    </>
                )}

                {/* Availability */}
                {availability.length > 0 && (
                    <>
                        <Text className="text-xl font-bold text-gray-800 mb-3">Availability</Text>
                        <Card className="mb-6">
                            {availability.map((slot, index) => (
                                <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                    <Text className="text-gray-700 font-medium">{getDayName(slot.day_of_week)}</Text>
                                    <Text className="text-gray-600">{slot.start_time} - {slot.end_time}</Text>
                                </View>
                            ))}
                        </Card>
                    </>
                )}
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
