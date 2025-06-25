module.exports = {
    dependencies: {
        'react-native-fast-image': {
            platforms: {
                android: {
                    packageImportPath: 'import io.dylanvann.fastimage.FastImageViewPackage;',
                    sourceDir: '../node_modules/react-native-fast-image/android',
                },
            },
        },
    },
}; 