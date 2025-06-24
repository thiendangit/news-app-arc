import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { useTheme } from '@/theme';

type Tab = {
    id: string;
    label: string;
    type: any;
};

type TabSelectorProps = {
    tabs: Tab[];
    selectedTab: any;
    onTabSelect: (tabId: string) => void;
};

const { width: screenWidth } = Dimensions.get('window');

export const TabSelector: React.FC<TabSelectorProps> = ({
    tabs,
    selectedTab,
    onTabSelect,
}) => {
    const { colors, fonts, layout } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Calculate active tab index
    const activeIndex = tabs.findIndex(tab => tab.type === selectedTab);

    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: activeIndex,
            useNativeDriver: true,
            tension: 120,
            friction: 8,
        }).start();
    }, [activeIndex, animatedValue]);

    // More precise calculations for wrapper
    const containerHorizontalPadding = 32; // 16px each side
    const wrapperPadding = 8; // 4px each side
    const wrapperWidth = screenWidth - containerHorizontalPadding;
    const contentWidth = wrapperWidth - wrapperPadding;
    const tabWidth = contentWidth / 3;

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [4, tabWidth + 4, (tabWidth * 2) + 4],
    });

    const styles = {
        container: [
            layout.row,
            layout.justifyCenter,
            layout.itemsCenter,
            {
                paddingHorizontal: 16,
                paddingVertical: 8,
            },
        ],
        wrapper: [
            layout.row,
            layout.itemsCenter,
            {
                backgroundColor: '#F5F5F5',
                borderRadius: 25,
                paddingHorizontal: 4,
                paddingVertical: 4,
                position: 'relative' as const,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                width: wrapperWidth,
            },
        ],
        animatedBackground: {
            position: 'absolute' as const,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            height: 36,
            width: tabWidth - 8,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
        },
        tabItem: [
            {
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 20,
                width: tabWidth,
                zIndex: 1,
            },
            layout.relative,
        ],
        tabText: [
            fonts.size_12,
            {
                textAlign: 'center' as const,
                fontWeight: '500' as const,
            },
        ],
        activeTabText: [
            fonts.size_12,
            fonts.bold,
            {
                color: colors.gray800,
                textAlign: 'center' as const,
            },
        ],
        inactiveTabText: [
            fonts.size_12,
            {
                color: colors.gray200,
                textAlign: 'center' as const,
                fontWeight: '500' as const,
            },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                {/* Animated background */}
                <Animated.View
                    style={[
                        styles.animatedBackground,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                />

                {/* Tab items */}
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabSelect(tab.id)}
                        style={styles.tabItem}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selectedTab === tab.type
                                    ? styles.activeTabText
                                    : styles.inactiveTabText,
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}; 