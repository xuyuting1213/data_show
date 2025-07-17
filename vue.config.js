module.exports = {
    transpileDependencies: true,
    devServer: {
        client: {
            overlay: false // 编译错误时，取消全屏覆盖
        },
        //  host: '200.150.100.69',2他反而访问不到
        client:{
             webSocketURL: 'ws://10.114.119.30:8080/ws',
            overlay: false // 编译错误时，取消全屏覆盖

        },
        // headers: {
        //     'Access-Control-Allow-Origin': '*',
        // },
        proxy: {
            '/api': {
                target: 'http://200.150.100.70:8000',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            },
            '/reportapi': {
                target: 'http://200.150.100.70:12002',
                changeOrigin: true,
                pathRewrite: { '^/reportapi': '' }
            
            },
            '/requestapi': {
                target: 'http://200.150.100.70:12345',
                changeOrigin: true,
                pathRewrite: { '^/requestapi': '' }
            },
            '/zfapi':{//http://49.77.204.3:10088/prod-api
                target: 'http://49.77.204.3:10088',
                changeOrigin: true,
                pathRewrite: { '^/zfapi': '' }
            },
            'viedo_api':{//http://200.150.100.250:8081
                target: 'http://200.150.100.250:8081/api',
                changeOrigin: true,
                pathRewrite: { '^/viedo_api': '' }
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map'
    }
};
