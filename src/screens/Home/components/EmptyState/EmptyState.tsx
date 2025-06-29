import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useI18n } from '@/hooks';

import { useEmptyStateStyles } from './EmptyState.styles';

type Props = {
    readonly onRetry: () => void;
};

export function EmptyState({ onRetry }: Props) {
    const { t } = useI18n();
    const styles = useEmptyStateStyles();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{t('home.no_stories')}</Text>
            <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
                <Text style={styles.retryText}>{t('home.retry')}</Text>
            </TouchableOpacity>
        </View>
    );
} 