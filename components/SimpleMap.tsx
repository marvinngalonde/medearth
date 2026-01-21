import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SimpleMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    width?: number | string;
    height?: number | string;
    markers?: Array<{
        latitude: number;
        longitude: number;
        color?: string;
    }>;
}

export const SimpleMap: React.FC<SimpleMapProps> = ({
    latitude,
    longitude,
    zoom = 15,
    width = '100%',
    height = 200,
    markers = [],
}) => {
    // Using Google Static Maps API for simple map display
    const apiKey = 'AIzaSyDummyKeyForDemo'; // Replace with actual key or use env variable

    // Build markers parameter for URL
    const markerParams = markers.map((marker, index) => {
        const color = marker.color || 'red';
        return `markers=color:${color}%7C${marker.latitude},${marker.longitude}`;
    }).join('&');

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=600x400&maptype=roadmap${markerParams ? '&' + markerParams : ''}&key=${apiKey}`;

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Fallback to a simple colored view if no API key */}
            <View style={styles.placeholder}>
                <View style={styles.marker} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    placeholder: {
        flex: 1,
        backgroundColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    marker: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#EF4444',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
});
