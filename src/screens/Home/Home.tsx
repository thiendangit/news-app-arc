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

import { AssetByVariant, IconByVariant, Skeleton } from '@/components/atoms';
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
    // Skeleton loading for "load more" - lighter and fewer items
    return (
      <View style={{ paddingHorizontal: 4, paddingVertical: 8 }}>
        {Array.from({length: 2}).fill(0).map((_, index) => (
          <View key={`footer-skeleton-${index}`} style={{ opacity: 0.5 }}>
            {renderSkeletonNewsItem(`footer-${index}`)}
          </View>
        ))}
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

  // Modern skeleton with card-based design
  const renderSkeletonNewsItem = (index: number | string) => (
    <View key={`skeleton-${index}`} style={[styles.newsCard, {
      backgroundColor: '#FAFAFA',
      borderRadius: 16,
      height: 240,
      marginBottom: 16,
      overflow: 'hidden',
    }]}>
      <View style={styles.newsContent}>
        {/* Image placeholder with shimmer effect */}
        <View style={{
          backgroundColor: '#F0F0F0',
          borderRadius: 12,
          height: 120,
          marginBottom: 12,
          overflow: 'hidden',
          position: 'relative',
          width: '100%'
        }}>
          <Skeleton
            height={120}
            loading
            style={{
              backgroundColor: 'transparent',
              left: 0,
              position: 'absolute',
              top: 0
            }}
            width="100%"
          />
        </View>

        {/* Title lines with varying lengths */}
        <View style={{ marginBottom: 12 }}>
          <View style={{
            backgroundColor: '#E8E8E8',
            borderRadius: 3,
            height: 16,
            marginBottom: 6,
            width: '92%'
          }}>
            <Skeleton height={16} loading width="100%" />
          </View>
        </View>

        {/* Metadata row - mimicking source • time • domain */}
        <View style={[styles.newsMetadata, { marginBottom: 12 }]}>
          <View style={{
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 50
          }}>
            <Skeleton height={12} loading width="100%" />
          </View>
          <View style={{
            backgroundColor: '#DDDDDD',
            borderRadius: 1.5,
            height: 3,
            marginHorizontal: 8,
            width: 3
          }} />
          <View style={{
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 60
          }}>
            <Skeleton height={12} loading width="100%" />
          </View>
          <View style={{
            backgroundColor: '#DDDDDD',
            borderRadius: 1.5,
            height: 3,
            marginHorizontal: 8,
            width: 3
          }} />
          <View style={{
            backgroundColor: '#EEEEEE',
            borderRadius: 2,
            height: 12,
            width: 70
          }}>
            <Skeleton height={12} loading width="100%" />
          </View>
        </View>

        {/* Actions row */}
        <View style={styles.newsActions}>
          <View style={[styles.newsActions, { flex: 1 }]}>
            {/* Score */}
            <View style={[styles.actionButton, { marginRight: 16 }]}>
              <View style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 7,
                height: 14,
                marginRight: 4,
                width: 14
              }}>
                <Skeleton height={14} loading width={14} />
              </View>
              <View style={{
                backgroundColor: '#EEEEEE',
                borderRadius: 2,
                height: 12,
                width: 20
              }}>
                <Skeleton height={12} loading width="100%" />
              </View>
            </View>

            {/* Comments */}
            <View style={[styles.actionButton, { marginRight: 16 }]}>
              <View style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 7,
                height: 14,
                marginRight: 4,
                width: 14
              }}>
                <Skeleton height={14} loading width={14} />
              </View>
              <View style={{
                backgroundColor: '#EEEEEE',
                borderRadius: 2,
                height: 12,
                width: 16
              }}>
                <Skeleton height={12} loading width="100%" />
              </View>
            </View>

            {/* Type badge */}
            <View style={{
              alignItems: 'center',
              backgroundColor: '#F0F0F0',
              borderRadius: 10,
              height: 20,
              justifyContent: 'center',
              width: 40
            }}>
              <Skeleton height={20} loading width={40} />
            </View>
          </View>

          {/* More button */}
          <View style={styles.iconMoreContainer}>
            <View style={{
              backgroundColor: '#F0F0F0',
              borderRadius: 8,
              height: 16,
              width: 16
            }}>
              <Skeleton height={16} loading width={16} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
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
            onPress={handlers.toggleLanguage}
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
            {Array.from({length: 4}).fill(0).map((_, index) => renderSkeletonNewsItem(index))}
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
