import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { useI18n, useUser } from '@/hooks';
import { useTheme } from '@/theme';

const MAX_RANDOM_ID = 9;

export const useExampleViewModel = () => {
    const { t } = useTranslation();
    const { useFetchOneQuery } = useUser();
    const { toggleLanguage } = useI18n();
    const theme = useTheme();

    const [currentId, setCurrentId] = useState(-1);
    const fetchOneUserQuery = useFetchOneQuery(currentId);

    useEffect(() => {
        if (fetchOneUserQuery.isSuccess) {
            Alert.alert(
                t('screen_example.hello_user', { name: fetchOneUserQuery.data.name }),
            );
        }
    }, [fetchOneUserQuery.isSuccess, fetchOneUserQuery.data, t]);

    const onChangeTheme = () => {
        theme.changeTheme(theme.variant === 'default' ? 'dark' : 'default');
    };

    const handleResetError = () => {
        void fetchOneUserQuery.refetch();
    };

    const handleFetchUser = () => {
        setCurrentId(Math.ceil(Math.random() * MAX_RANDOM_ID + 1));
    };

    return {
        // State
        fetchOneUserQuery,

        // Actions
        onChangeTheme,
        handleResetError,
        handleFetchUser,
        toggleLanguage,

        // Theme & Translations
        theme,
        t,
    };
}; 