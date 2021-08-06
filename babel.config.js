module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        ["import", {"libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css"}] // `style: true` 会加载 less 文件
    ],
    env: {
        'development': {
            'plugins': ['dynamic-import-node']
        },
        /*'production': {
          'plugins': ['transform-remove-console']
        }*/
    }
}
