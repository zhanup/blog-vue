module.exports = {
    devServer: {
        open: true,
        proxy: {
            '/api': {  // 跨域处理
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }

}
