import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    unocss: true,
    rules: {
      'e18e/prefer-static-regex': 'off',
    },
  },
)
