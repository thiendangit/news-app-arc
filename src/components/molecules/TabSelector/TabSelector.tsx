import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTheme } from '@/theme';
type Tab = {
    id: string;
    label: string;
    type: any;
};
type TabSelectorProps = {
    readonly onTabSelect: (tabId: string) => void;
    readonly selectedTab: any;
    readonly tabs: Tab[];
};
const { width: screenWidth } = Dimensions.get('window');
export const TabSelector: React.FC<TabSelectorProps> = ({
    onTabSelect,
    selectedTab,
    tabs,
}) => {
    const { colors, fonts, layout } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const activeIndex = tabs.findIndex(tab => tab.type === selectedTab);
    useEffect(() => {
        Animated.spring(animatedValue, {
            friction: 8,
            tension: 120,
            toValue: activeIndex,
            useNativeDriver: true,
        }).start();
    }, [activeIndex, animatedValue]);
    const containerHorizontalPadding = 32;
    const wrapperPadding = 8;
    const wrapperWidth = screenWidth - containerHorizontalPadding;
    const contentWidth = wrapperWidth - wrapperPadding;
    const tabWidth = contentWidth / 3;
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [4, tabWidth + 4, (tabWidth * 2) + 4],
    });
    const styles = {
        activeTabText: [
            fonts.size_12,
            fonts.bold,
            {
                color: colors.gray800,
                textAlign: 'center' as const,
            },
        ],
        animatedBackground: {
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            elevation: 3,
            height: 36,
            position: 'absolute' as const,
            shadowColor: '#000',
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 4,
            width: tabWidth - 8,
        },
        container: [
            layout.row,
            layout.justifyCenter,
            layout.itemsCenter,
            {
                paddingHorizontal: 16,
                paddingVertical: 8,
            },
        ],
        inactiveTabText: [
            fonts.size_12,
            {
                color: colors.gray200,
                fontWeight: '500' as const,
                textAlign: 'center' as const,
            },
        ],
        tabItem: [
            {
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 10,
                width: tabWidth,
                zIndex: 1,
            },
            layout.relative,
        ],
        tabText: [
            fonts.size_12,
            {
                fontWeight: '500' as const,
                textAlign: 'center' as const,
            },
        ],
        wrapper: [
            layout.row,
            layout.itemsCenter,
            {
                backgroundColor: '#F5F5F5',
                borderRadius: 25,
                elevation: 2,
                paddingHorizontal: 4,
                paddingVertical: 4,
                position: 'relative' as const,
                shadowColor: '#000',
                shadowOffset: { height: 1, width: 0 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                width: wrapperWidth,
            },
        ],
    };
    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                { }
                <Animated.View
                    style={[
                        styles.animatedBackground,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                />
                { }
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => { onTabSelect(tab.id); }}
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