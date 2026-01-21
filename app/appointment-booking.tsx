import { Button, Card } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function AppointmentBookingScreen() {
    const router = useRouter();
    const { doctorId } = useLocalSearchParams();

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Mock data
    const doctor = {
        name: 'Dr. Sarafaraz',
        specialty: 'Cardiology',
        fee: 15.00,
    };

    const availableDates = [
        { date: '2026-01-22', day: 'Wed', dayNum: '22' },
        { date: '2026-01-24', day: 'Fri', dayNum: '24' },
        { date: '2026-01-27', day: 'Mon', dayNum: '27' },
        { date: '2026-01-29', day: 'Wed', dayNum: '29' },
    ];

    const timeSlots = [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
        '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
        '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
    ];

    const handleBooking = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }
        // TODO: Create appointment
        router.push('/order-confirmation?type=appointment' as any);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-primary pt-12 pb-6 px-6">
                <View className="flex-row items-center mb-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-xl font-bold">Book Appointment</Text>
                        <Text className="text-blue-200">{doctor.name} - {doctor.specialty}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* Select Date */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Select Date</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                    {availableDates.map((item) => (
                        <TouchableOpacity
                            key={item.date}
                            onPress={() => setSelectedDate(item.date)}
                            className="mr-3"
                        >
                            <Card className={`w-20 items-center py-4 ${selectedDate === item.date ? 'bg-primary' : ''}`}>
                                <Text className={`text-sm ${selectedDate === item.date ? 'text-white' : 'text-gray-600'}`}>
                                    {item.day}
                                </Text>
                                <Text className={`text-2xl font-bold mt-1 ${selectedDate === item.date ? 'text-white' : 'text-gray-800'}`}>
                                    {item.dayNum}
                                </Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Select Time */}
                <Text className="text-lg font-bold text-gray-800 mb-3">Select Time</Text>
                <View className="flex-row flex-wrap mb-6">
                    {timeSlots.map((time) => (
                        <TouchableOpacity
                            key={time}
                            onPress={() => setSelectedTime(time)}
                            className="w-[30%] mr-[3%] mb-3"
                        >
                            <Card className={`items-center py-3 ${selectedTime === time ? 'bg-primary' : ''}`}>
                                <Text className={`font-semibold ${selectedTime === time ? 'text-white' : 'text-gray-800'}`}>
                                    {time}
                                </Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Summary */}
                {selectedDate && selectedTime && (
                    <Card className="mb-6">
                        <Text className="font-bold text-gray-800 mb-3">Appointment Summary</Text>
                        <View className="flex-row items-center mb-2">
                            <Calendar size={16} color="#6B7280" />
                            <Text className="ml-2 text-gray-700">{selectedDate}</Text>
                        </View>
                        <View className="flex-row items-center mb-3">
                            <Clock size={16} color="#6B7280" />
                            <Text className="ml-2 text-gray-700">{selectedTime}</Text>
                        </View>
                        <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                            <Text className="text-gray-600">Consultation Fee</Text>
                            <Text className="font-bold text-primary text-lg">${doctor.fee.toFixed(2)}</Text>
                        </View>
                    </Card>
                )}
            </ScrollView>

            {/* Book Button */}
            <View className="p-6 border-t border-gray-200 bg-white">
                <Button
                    title="Confirm Booking"
                    onPress={handleBooking}
                />
            </View>
        </View>
    );
}
