module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 临时允许未使用变量
        'no-unused-vars': 'off',
        // 注释前，可以有多个空格以便注释对其
        'no-multi-spaces': [2, { ignoreEOLComments: true }],
        'no-trailing-spaces': 'off',
        // 允许特殊控制字符出现正则中
        'no-control-regex': 'off',
        // allow async-await
        'generator-star-spacing': 'off',
        // allow space-less before functions
        'space-before-function-paren': 'off',
        'no-new': 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
