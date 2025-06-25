import { LinkPreview } from '@flyerhq/react-native-link-preview';
import { LinkPreviewProps } from "@flyerhq/react-native-link-preview/lib/LinkPreview";
import { PreviewData } from '@flyerhq/react-native-link-preview/lib/types';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Dimensions, StyleProp, View, ViewStyle } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
type LinkPreviewImageProps = {
    readonly aspectRatio?: number;
    readonly containerStyle?: StyleProp<ViewStyle>;
    readonly enableAnimation?: boolean;
    readonly imageStyle?: FastImageProps['style'];
    readonly onPressEnable?: boolean;
    readonly resizeMode?: FastImageProps['resizeMode'];
    readonly url: string;
} & Partial<LinkPreviewProps>;
function LinkPreviewImageComponent({
    enableAnimation = true,
    onPressEnable = false,
    resizeMode = FastImage.resizeMode.cover,
    url,
    ...rest
}: LinkPreviewImageProps) {
    const windowWidth = Dimensions.get('window').width;
    const defaultAspectRatio = rest.aspectRatio ?? windowWidth / (windowWidth * 0.6);
    return (
        <View pointerEvents={onPressEnable ? 'box-only' : 'none'} style={rest.containerStyle}>
            <LinkPreview
                containerStyle={rest.containerStyle}
                enableAnimation={enableAnimation}
                renderLinkPreview={(payload: {
                    aspectRatio?: number;
                    containerWidth: number;
                    previewData?: PreviewData;
                }) => {
                    const imageUrl = payload.previewData?.image?.url;
                    if (imageUrl) {
                        return (
                            <FastImage
                                fallback
                                resizeMode={resizeMode}
                                source={{
                                    uri: imageUrl,
                                }}
                                style={[rest.imageStyle, { aspectRatio: defaultAspectRatio }]}
                            />
                        );
                    }
                    return undefined;
                }}
                {...rest}
                text={url}
            />
        </View>
    );
}
export const LinkPreviewImage = memo(LinkPreviewImageComponent, isEqual); 