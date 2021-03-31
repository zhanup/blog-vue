const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {  // 跨域处理
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },
    /* 添加分析工具 */
    chainWebpack: (config) => {
        if (process.env.NODE_ENV  === 'production') {
            if (process.env.npm_config_report) {
                config
                    .plugin('webpack-bundle-analyzer')
                    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                    .end();
                config.plugins.delete('prefetch')
            }
        }
    },
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        }
    }

}
