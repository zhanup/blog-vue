module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {  // 跨域处理
                target: 'http://127.0.0.1:3000',
                changeOrigin: true
            }
        }
    }

}
