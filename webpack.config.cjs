const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
    entry: './ckeditorcs.js', // Your editor build configuration.
    output: {
        filename: 'editor.bundle.js', // Content of this file is required to upload to CKEditor Cloud Services.
        library: 'CKEditorCS', // It is required to expose you editor class under the "CKEditorCS" name!

        libraryTarget: 'umd',
        libraryExport: 'default',
        clean: true
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    performance: { hints: false }
};
