import type { RootScreenProps } from '@/navigation/types';

import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';

import { useI18n } from '@/hooks';
import { Paths } from '@/navigation/paths';

import { AssetByVariant, IconByVariant } from '@/components/atoms';
import { TabSelector } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

import { EmptyState, LoadMoreFooter, NewsItem, SkeletonNewsItem } from './components';
import { useHomeStyles } from './Home.styles.ts';
import { NewsItemType } from './Home.types';
import { useHomeViewModel } from './Home.viewModel';


function Home() {
  const navigation = useNavigation<RootScreenProps<Paths.Home>['navigation']>();
  const { t } = useI18n();
  const { handlers, selectors } = useHomeViewModel();
  const styles = useHomeStyles();

  const translatedCategories = selectors.newsCategories.map(category => ({
    ...category,
    label: t(`home.tabs.${category.label.toLowerCase()}`),
  }));

  const handleStoryPress = (story: NewsItemType) => {
    navigation.navigate(Paths.StoryDetail, {
      story: story,
      storyId: story.id,
    });
  };

  const handleNotifications = () => {
    Alert.alert(
      'Thông báo',
      'Bạn có 3 thông báo mới!\n\n• Tin tức mới từ Hacker News\n• Bình luận mới cho bài đăng\n• Cập nhật ứng dụng',
      [{ text: 'OK' }]
    );
  };

  const renderNewsItem = ({ item }: { item: NewsItemType }) => (
    <NewsItem item={item} onPress={handleStoryPress} />
  );

  const renderListFooter = () => {
    if (!selectors.isFetchingNextPage) {
      return undefined;
    }
    return <LoadMoreFooter />;
  };

  const renderListEmpty = () => {
    if (selectors.isLoadingNews) {
      return undefined;
    }
    return <EmptyState onRetry={handlers.handleResetError} />;
  };

  const handleEndReached = () => {
    if (selectors.hasNextPage && !selectors.isFetchingNextPage && !selectors.isLoadingNews) {
      void handlers.loadMore();
    }
  };

  const toggleLanguage = handlers.toggleLanguage;

  return (
    <SafeScreen isError={selectors.isError} onResetError={handlers.handleResetError}>
      <View style={styles.header}>
        <AssetByVariant path="logo" resizeMode="cover" style={styles.logo} />
        <View style={styles.headerActions}>
          {selectors.isFetching && !selectors.isLoadingNews ? <ActivityIndicator
            color={selectors.theme.colors.orange500}
            size="small"
            style={{ marginRight: 8 }}
          /> : undefined}
          <TouchableOpacity onPress={handleNotifications} style={styles.headerButton}>
            <AssetByVariant path="notification" resizeMethod="auto" style={styles.iconNotification} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={styles.headerButton}
          >
            <IconByVariant path="language" stroke={selectors.theme.colors.orange500} />
          </TouchableOpacity>
        </View>
      </View>
      <TabSelector
        onTabSelect={handlers.handleCategorySelect}
        selectedTab={selectors.selectedCategory}
        tabs={translatedCategories}
      />
      <View style={styles.newsContainer}>
        {selectors.isLoadingNews && selectors.newsData.length === 0 ? (
          // Skeleton loading state - more realistic count
          <View style={{ flex: 1, paddingTop: 8 }}>
            {Array.from({ length: 4 })
              .fill(0)
              .map((_, index) => (
                <SkeletonNewsItem index={index} key={index} />
              ))}
          </View>
        ) : (
          <FlashList
            data={selectors.newsData}
            estimatedItemSize={200}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderListEmpty}
            ListFooterComponent={renderListFooter}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.8}
            refreshControl={
              <RefreshControl
                colors={[selectors.theme.colors.orange500]}
                onRefresh={handlers.handleRefresh}
                refreshing={selectors.isRefreshing}
                tintColor={selectors.theme.colors.orange500}
              />
            }
            renderItem={renderNewsItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeScreen>
  );
}
export const HomeScreen = memo(Home, isEqual);
