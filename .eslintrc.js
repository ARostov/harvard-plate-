module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Базовые правила
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        // Vue правила
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-components': 'warn',
        'vue/no-unused-vars': 'warn',

        // JavaScript правила
        'no-unused-vars': 'warn',
        'no-undef': 'error',
        'semi': ['error', 'never'],
        'quotes': ['error', 'single'],
        'indent': ['error', 2]
    }
}