import { theme } from '@/constants/theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { usePathname } from 'expo-router';
import { Building2, Home, MessageCircle, User } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 5;
const TAB_BAR_HEIGHT = 70;

export function CurvedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const validInsets = insets ?? { bottom: 0, left: 0, right: 0, top: 0 }; // Fallback
    const pathname = usePathname();

    // Define the SVG curve path
    // This creates a smooth dip in the center for the notch
    const center = width / 2;
    const curveWidth = 80;
    const curveDepth = 40;

    const d = `
    M0,0 
    L${center - curveWidth / 2},0 
    C${center - curveWidth / 4},0 ${center - curveWidth / 4},${curveDepth} ${center},${curveDepth} 
    C${center + curveWidth / 4},${curveDepth} ${center + curveWidth / 4},0 ${center + curveWidth / 2},0 
    L${width},0 
    L${width},${TAB_BAR_HEIGHT + validInsets.bottom} 
    L0,${TAB_BAR_HEIGHT + validInsets.bottom} 
    Z
  `;

    return (
        <View style={styles.container}>
            <Svg width={width} height={TAB_BAR_HEIGHT + validInsets.bottom} style={styles.svg}>
                <Path d={d} fill="white" {...theme.shadows.md} />
            </Svg>

            <View style={[styles.content, { paddingBottom: validInsets.bottom }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const isCenter = index === 2; // Assuming the middle item is index 2

                    // Define icons specifically for this concept if needed, or use the ones passed from options
                    // But since we are rebuilding the render, let's map them manally for full control or use options.
                    // Using options is safer for dynamic changes.

                    let IconComponent = Home;
                    if (route.name === 'index') IconComponent = Home;
                    if (route.name === 'doctors') IconComponent = User; // Or Stethoscope if valid
                    if (route.name === 'pharmacies') IconComponent = Building2;
                    if (route.name === 'messages') IconComponent = MessageCircle;
                    if (route.name === 'profile') IconComponent = User;

                    const color = isFocused ? theme.colors.primary.DEFAULT : theme.colors.gray[400];

                    if (isCenter) {
                        return (
                            <View key={route.key} style={styles.centerButtonContainer}>
                                <TouchableOpacity
                                    style={[styles.centerButton, theme.shadows.lg]}
                                    onPress={onPress}
                                >
                                    {/* Center button is now Pharmacies */}
                                    <Building2 size={32} color="white" />
                                </TouchableOpacity>
                                <Text style={[styles.label, { color, marginTop: 4, opacity: isFocused ? 1 : 0 }]}>
                                    {typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title}
                                </Text>
                            </View>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                        >
                            {/* We can use the tabBarIcon function from options if provided, but direct rendering is easier for custom colors */}
                            {options.tabBarIcon ? (
                                options.tabBarIcon({ focused: isFocused, color, size: 24 })
                            ) : (
                                <IconComponent size={24} color={color} />
                            )}

                            <Text style={[styles.label, { color }]}>
                                {typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        elevation: 0, // Remove default elevation to handle shadow manually via SVG or View
        backgroundColor: 'transparent',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        height: '100%',
        alignItems: 'flex-end',
    },
    tabItem: {
        width: ITEM_WIDTH,
        height: 60, // Visible height content
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerButtonContainer: {
        width: ITEM_WIDTH,
        height: 70,
        justifyContent: 'flex-start', // Push button up
        alignItems: 'center',
        marginTop: -25, // Move the container up into the notch
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 2,
    },
});
