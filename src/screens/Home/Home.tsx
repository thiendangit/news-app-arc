import type { RootScreenProps } from '@/navigation/types';

import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Paths } from '@/navigation/paths';

import { AssetByVariant, IconByVariant } from '@/components/atoms';
import { TabSelector } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

import { useExampleStyles } from './Home.styles';
import { useExampleViewModel } from './Home.viewModel';

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

  const {
    handleCategorySelect,
    handleResetError,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoadingNews,
    loadMore,
    newsCategories,
    newsData,
    onChangeTheme,
    selectedCategory,
    theme,
    toggleLanguage,
  } = useExampleViewModel();

  const styles = useExampleStyles();

  const windowWidth = Dimensions.get('window').width;

  // Remove renderCategoryItem as we'll use TabSelector component

  const handleStoryPress = (story: NewsItem) => {
    navigation.navigate(Paths.StoryDetail, {
      story: story,
      storyId: story.id,
    });
  };

  // Component hiển thị preview ảnh của link
  const renderStoryLinkPreview = useCallback(
    (url: string) => {
      return (
        <View style={styles.linkPreviewContainer}>
          <LinkPreview
            containerStyle={styles.linkPreviewContainer}
            enableAnimation
            renderLinkPreview={(payload: {
              aspectRatio?: number;
              containerWidth: number;
              previewData?: PreviewData;
            }) => {
              const imageUrl = payload.previewData?.image?.url;
              if (imageUrl) {
                return (
                  <Image
                    resizeMode="cover"
                    source={{ uri: imageUrl }}
                    style={[
                      styles.linkPreviewImage,
                      { aspectRatio: windowWidth / (windowWidth * 0.6) },
                    ]}
                  />
                );
              }
              return undefined;
            }}
            text={url}
          />
        </View>
      );
    },
    [styles.linkPreviewContainer, styles.linkPreviewImage, windowWidth],
  );

  const renderNewsItem = ({ item }: { item: NewsItem }) => {
    const onStoryPress = () => {
      handleStoryPress(item);
    };

    return (
      <TouchableOpacity onPress={onStoryPress} style={styles.newsCard}>
        <View style={styles.newsContent}>
          {item.url ? renderStoryLinkPreview(item.url) : undefined}
          <Text numberOfLines={3} style={styles.newsTitle}>
            {item.title}
          </Text>

          <View style={styles.newsMetadata}>
            <Text style={styles.newsSource}>{item.source}</Text>
            <Text style={styles.newsDot}>•</Text>
            <Text style={styles.newsTime}>{item.timeAgo}</Text>
            {item.domain ? (
              <>
                <Text style={styles.newsDot}>•</Text>
                <Text style={styles.newsDomain}>{item.domain}</Text>
              </>
            ) : undefined}
          </View>

          <View style={styles.newsActions}>
            <View style={styles.newsActions}>
              <View style={styles.actionButton}>
                <AssetByVariant path="like" style={styles.icon} />
                <Text style={styles.actionText}>{item.score}</Text>
              </View>
              <View style={styles.actionButton}>
                <AssetByVariant path="comment" style={styles.icon} />
                <Text style={styles.actionText}>{item.commentsCount}</Text>
              </View>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.storyType}>{item.type}</Text>
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
    if (!isFetchingNextPage) {
      return undefined;
    }

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator color={theme.colors.orange500} size="small" />
        <Text style={styles.loadingText}>Loading more stories...</Text>
      </View>
    );
  };

  const renderListEmpty = () => {
    if (isLoadingNews) {
      return undefined;
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No stories found</Text>
        <TouchableOpacity onPress={handleResetError} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoadingNews) {
      void loadMore();
    }
  };

  return (
    <SafeScreen isError={isError} onResetError={handleResetError}>
      {/* Header */}
      <View style={styles.header}>
        <AssetByVariant path="logo" resizeMode="cover" style={styles.logo} />
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onChangeTheme} style={styles.headerButton}>
            <IconByVariant path="theme" stroke={theme.colors.orange500} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleLanguage}
            style={styles.headerButton}
          >
            <IconByVariant path="language" stroke={theme.colors.orange500} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Categories Filter */}
      <TabSelector
        onTabSelect={handleCategorySelect}
        selectedTab={selectedCategory}
        tabs={newsCategories}
      />

      {/* Stories List */}
      <View style={styles.newsContainer}>
        {isLoadingNews && newsData.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={theme.colors.orange500} size="large" />
            <Text style={styles.loadingText}>Loading stories...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.newsList}
            data={newsData}
            initialNumToRender={20}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderListEmpty}
            ListFooterComponent={renderListFooter}
            maxToRenderPerBatch={10}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.8}
            removeClippedSubviews
            renderItem={renderNewsItem}
            showsVerticalScrollIndicator={false}
            windowSize={10}
          />
        )}
      </View>
    </SafeScreen>
  );
}

export const HomeScreen = memo(Home, isEqual);
