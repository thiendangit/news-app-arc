import type { RootScreenProps } from '@/navigation/types';

import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { useI18n } from '@/hooks';
import { Paths } from '@/navigation/paths';

import { AssetByVariant, IconByVariant } from '@/components/atoms';
import { LinkPreviewImage, TabSelector } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

import { useExampleStyles } from './Home.styles';
import { useHomeViewModel } from './Home.viewModel';
type NewsItem = {
  commentsCount: number;
  domain: string;
  id: number;
  score: number;
  source: string;
  timeAgo: string;
  title: string;
  type: string;
  url: string;
};
function Home() {
  const navigation = useNavigation<RootScreenProps<Paths.Home>['navigation']>();
  const { t } = useI18n();
  const { handlers, selectors } = useHomeViewModel();
  const styles = useExampleStyles();
  const translatedCategories = selectors.newsCategories.map(category => ({
    ...category,
    label: t(`home.tabs.${category.label.toLowerCase()}`),
  }));
  const handleStoryPress = (story: NewsItem) => {
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
  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const onStoryPress = () => {
      handleStoryPress(item);
    };
    return (
      <TouchableOpacity onPress={onStoryPress} style={styles.newsCard}>
        <View style={styles.newsContent}>
          {item.url ? (
            <LinkPreviewImage
              containerStyle={styles.linkPreviewContainer}
              imageStyle={styles.linkPreviewImage}
              resizeMode={FastImage.resizeMode.cover}
              url={item.url}
            />
          ) : undefined}
          <Text numberOfLines={3} style={styles.newsTitle}>
            {item.title}
          </Text>
          <View style={styles.newsMetadata}>
            <Text style={styles.newsSource}>{item.source}</Text>
            <Text style={styles.newsDot}>•</Text>
            <Text style={styles.newsTime}>{item.timeAgo}</Text>
            {item.domain ? <>
              <Text style={styles.newsDot}>•</Text>
              <Text style={styles.newsDomain}>{item.domain}</Text>
            </> : undefined}
          </View>
          <View style={styles.newsActions}>
            <View style={styles.newsActions}>
              <View style={styles.actionButton}>
                <AssetByVariant path="reward" style={styles.icon} />
                <Text style={styles.scoreText}>{item.score}</Text>
              </View>
              <View style={styles.actionButton}>
                <AssetByVariant path="comment" style={styles.icon} />
                <Text style={styles.actionText}>{item.commentsCount}</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.storyType}>{item.type.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.iconMoreContainer}>
              <AssetByVariant path="more" style={[styles.icon]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderListFooter = () => {
    if (!selectors.isFetchingNextPage) {
      return undefined;
    }
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={selectors.theme.colors.orange500} size="small" />
        <Text style={styles.loadingText}>{t('home.loading_more')}</Text>
      </View>
    );
  };
  const renderListEmpty = () => {
    if (selectors.isLoadingNews) {
      return undefined;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('home.no_stories')}</Text>
        <TouchableOpacity onPress={handlers.handleResetError} style={styles.retryButton}>
          <Text style={styles.retryText}>{t('home.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const handleEndReached = () => {
    if (selectors.hasNextPage && !selectors.isFetchingNextPage && !selectors.isLoadingNews) {
      void handlers.loadMore();
    }
  };
  return (
    <SafeScreen isError={selectors.isError} onResetError={handlers.handleResetError}>
      { }
      <View style={styles.header}>
        <AssetByVariant path="logo" resizeMode="cover" style={styles.logo} />
        <View style={styles.headerActions}>
          { }
          {selectors.isFetching && !selectors.isLoadingNews ? <ActivityIndicator
            color={selectors.theme.colors.orange500}
            size="small"
            style={{ marginRight: 8 }}
          /> : undefined}
          <TouchableOpacity onPress={handleNotifications} style={styles.headerButton}>
            <AssetByVariant path="notification" resizeMethod="auto" style={styles.iconNotification} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlers.toggleLanguage}
            style={styles.headerButton}
          >
            <IconByVariant path="language" stroke={selectors.theme.colors.orange500} />
          </TouchableOpacity>
        </View>
      </View>
      { }
      <TabSelector
        onTabSelect={handlers.handleCategorySelect}
        selectedTab={selectors.selectedCategory}
        tabs={translatedCategories}
      />
      { }
      <View style={styles.newsContainer}>
        {selectors.isLoadingNews && selectors.newsData.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={selectors.theme.colors.orange500} size="large" />
            <Text style={styles.loadingText}>{t('home.loading_stories')}</Text>
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
